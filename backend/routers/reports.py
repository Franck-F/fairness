"""
Report generation endpoints (PDF, TXT).
"""

import io
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

from config import logger
from schemas import ReportRequest

router = APIRouter(prefix="/api", tags=["Reports"])


@router.post("/reports/generate")
async def generate_report(request: ReportRequest):
    """Generate an audit report in PDF or TXT format."""
    try:
        if request.format == "pdf":
            return _generate_pdf_report(request)
        else:
            return _generate_txt_report(request)
    except Exception as e:
        logger.error(f"Report generation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


def _generate_pdf_report(request: ReportRequest):
    """Generate a PDF report."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    title_style = ParagraphStyle(
        "CustomTitle",
        parent=styles["Heading1"],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor("#1a365d"),
    )
    elements.append(Paragraph("Rapport d'Audit de Fairness - AuditIQ", title_style))
    elements.append(Spacer(1, 20))

    # Dataset info
    elements.append(Paragraph(f"<b>Dataset:</b> {request.dataset_name}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles["Normal"]))
    elements.append(Paragraph(f"<b>ID Audit:</b> {request.audit_id}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    # Data Quality Section
    elements.append(Paragraph("Diagnostic de Qualite des Donnees", styles["Heading2"]))
    elements.append(Spacer(1, 10))

    quality_score = request.fairness_results.get("quality_score", 100)
    elements.append(Paragraph(f"Score de Qualite: <b>{quality_score}%</b>", styles["Normal"]))

    profiling = request.fairness_results.get("profiling", {})
    if profiling and "missing_values" in profiling:
        elements.append(Paragraph("Valeurs manquantes detectees:", styles["Normal"]))
        mv_data = [["Colonne", "Valeurs Manquantes"]]
        for col, count in list(profiling["missing_values"].items())[:10]:
            if count > 0:
                mv_data.append([col, str(count)])

        if len(mv_data) > 1:
            mv_table = Table(mv_data, colWidths=[3 * inch, 2 * inch])
            mv_table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ]
                )
            )
            elements.append(mv_table)
        else:
            elements.append(
                Paragraph("<i>Aucune valeur manquante majeure detectee.</i>", styles["Normal"])
            )

    elements.append(Spacer(1, 20))

    # Overall score
    results = request.fairness_results
    score = results.get("overall_score", 0)
    risk = results.get("risk_level", "N/A")

    score_style = ParagraphStyle(
        "Score",
        parent=styles["Heading2"],
        fontSize=18,
        textColor=colors.HexColor("#2d3748"),
    )
    elements.append(Paragraph(f"Score Global: {score}%", score_style))
    elements.append(Paragraph(f"Niveau de Risque: {risk.upper()}", styles["Normal"]))
    elements.append(Spacer(1, 20))

    # Metrics table
    elements.append(Paragraph("Metriques de Fairness par Attribut", styles["Heading2"]))
    elements.append(Spacer(1, 10))

    metrics_by_attr = results.get("metrics_by_attribute", {})
    for attr, metrics in metrics_by_attr.items():
        elements.append(Paragraph(f"<b>Attribut: {attr}</b>", styles["Normal"]))
        table_data = [["Metrique", "Valeur", "Seuil", "Statut"]]
        for m in metrics:
            if isinstance(m, dict):
                table_data.append(
                    [
                        m.get("name", "N/A"),
                        str(m.get("value", "N/A")),
                        str(m.get("threshold", "N/A")),
                        m.get("status", "N/A").upper(),
                    ]
                )

        if len(table_data) > 1:
            table = Table(table_data, colWidths=[2 * inch, 1 * inch, 1 * inch, 1 * inch])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4a5568")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f7fafc")),
                        ("GRID", (0, 0), (-1, -1), 1, colors.HexColor("#e2e8f0")),
                    ]
                )
            )
            elements.append(table)
            elements.append(Spacer(1, 15))

    # Recommendations
    recommendations = results.get("recommendations", [])
    if recommendations:
        elements.append(Paragraph("Recommandations", styles["Heading2"]))
        for rec in recommendations:
            elements.append(Paragraph(f"* {rec}", styles["Normal"]))

    # Methodology
    elements.append(Spacer(1, 30))
    elements.append(Paragraph("Methodologie & Limites", styles["Heading2"]))
    elements.append(
        Paragraph(
            "Cet audit a ete realise en utilisant le moteur AuditIQ, base sur les standards Fairlearn 0.8.0. "
            "Les metriques calculees (Statistical Parity, Disparate Impact, Equalized Odds) mesurent les disparites "
            "algorithmiques mais ne constituent pas une preuve juridique de discrimination. "
            "La fiabilite des resultats depend directement de la qualite du dataset fourni (principe GIGO).",
            styles["Normal"],
        )
    )

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=audit_report_{request.audit_id}.pdf"},
    )


def _generate_txt_report(request: ReportRequest):
    """Generate a TXT report."""
    report_text = f"""================================================
RAPPORT D'AUDIT DE FAIRNESS - AUDITIQ
================================================

Dataset: {request.dataset_name}
Date: {datetime.now().strftime('%d/%m/%Y %H:%M')}
ID Audit: {request.audit_id}

------------------------------------------------
RESULTATS GLOBAUX
------------------------------------------------
Score Global: {request.fairness_results.get('overall_score', 0)}%
Niveau de Risque: {request.fairness_results.get('risk_level', 'N/A').upper()}
Biais Detecte: {'OUI' if request.fairness_results.get('bias_detected', False) else 'NON'}

------------------------------------------------
METRIQUES PAR ATTRIBUT
------------------------------------------------
"""

    for attr, metrics in request.fairness_results.get("metrics_by_attribute", {}).items():
        report_text += f"\nAttribut: {attr}\n"
        report_text += "-" * 40 + "\n"
        for m in metrics:
            if isinstance(m, dict):
                report_text += f"  {m.get('name', 'N/A')}: {m.get('value', 'N/A')} (Seuil: {m.get('threshold', 'N/A')}) [{m.get('status', 'N/A').upper()}]\n"

    report_text += "\n------------------------------------------------\nRECOMMANDATIONS\n------------------------------------------------\n"
    for rec in request.fairness_results.get("recommendations", []):
        report_text += f"* {rec}\n"

    report_text += "\n================================================\nGenere par AuditIQ - Plateforme d'Audit IA\n================================================"

    return StreamingResponse(
        io.BytesIO(report_text.encode("utf-8")),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=audit_report_{request.audit_id}.txt"},
    )
