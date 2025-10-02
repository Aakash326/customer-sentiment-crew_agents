"""
Email Preview Tool for generating formatted email previews without actually sending emails.
This tool creates professional email previews that show what WOULD be sent to different departments.
"""
import json
from typing import Dict, List
from datetime import datetime

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class EmailPreviewInput(BaseModel):
    """Input schema for EmailPreviewTool."""
    emails_data: str = Field(
        ...,
        description="JSON string containing email data with fields: to, subject, body, priority, issue_type"
    )

class EmailPreviewTool(BaseTool):
    """
    Tool for creating formatted email previews.
    Does NOT send actual emails - only generates preview content for display.
    """
    name: str = "email_preview_generator"
    description: str = (
        "Generates formatted email previews showing what emails WOULD be sent to "
        "engineering, PR, or support teams. Creates professional email content "
        "with subject lines, recipients, and full message bodies."
    )
    args_schema: type[BaseModel] = EmailPreviewInput


    def _run(self, emails_data: str) -> str:
        """
        Generate formatted email previews from email data.
        
        Args:
            emails_data: JSON string containing email information
            
        Returns:
            Formatted string with email previews ready for display
        """
        try:
            # Parse the email data
            if isinstance(emails_data, str):
                email_list = json.loads(emails_data)
            else:
                email_list = emails_data
            
            if not isinstance(email_list, list):
                email_list = [email_list]
            
            # Generate formatted previews
            formatted_previews = []
            
            for i, email_data in enumerate(email_list, 1):
                preview = self._format_single_email_preview(email_data, i, len(email_list))
                formatted_previews.append(preview)
            
            # Combine all previews
            final_output = "\n\n".join(formatted_previews)
            
            # Add header and footer
            header = f"📧 EMAIL PREVIEWS GENERATED - {len(email_list)} EMAIL(S)\n"
            header += "=" * 60 + "\n"
            header += f"Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            header += "NOTE: These are PREVIEWS only - no actual emails sent!\n"
            header += "=" * 60
            
            footer = "\n" + "=" * 60 + "\n"
            footer += "✅ All email previews generated successfully!\n"
            footer += "💡 Review content before actual implementation."
            
            return f"{header}\n\n{final_output}{footer}"
            
        except Exception as e:
            return f"❌ Error generating email previews: {str(e)}"
    
    def _format_single_email_preview(self, email_data: Dict, number: int, total: int) -> str:
        """Format a single email preview with professional styling."""
        
        # Extract email components
        to_email = email_data.get('to', 'unknown@company.com')
        subject = email_data.get('subject', 'No Subject')
        body = email_data.get('body', 'No content provided')
        priority = email_data.get('priority', 'MEDIUM')
        issue_type = email_data.get('issue_type', 'General')
        
        # Create priority emoji
        priority_emoji = {
            'CRITICAL': '🚨',
            'HIGH': '⚠️',
            'MEDIUM': '📋',
            'LOW': '📝'
        }.get(priority.upper(), '📋')
        
        # Format the preview
        preview = f"📧 EMAIL PREVIEW {number}/{total}\n"
        preview += "━" * 40 + "\n"
        preview += f"{priority_emoji} PRIORITY: {priority.upper()}\n"
        preview += f"📁 CATEGORY: {issue_type}\n"
        preview += f"📧 TO: {to_email}\n"
        preview += f"📝 SUBJECT: {subject}\n"
        preview += "━" * 40 + "\n\n"
        
        # Add email body with proper formatting
        preview += "MESSAGE BODY:\n"
        preview += "─" * 20 + "\n"
        preview += f"{body}\n"
        preview += "─" * 20 + "\n"
        
        # Add metadata
        preview += f"\n📊 EMAIL STATS:\n"
        preview += f"   • Word Count: {len(body.split())}\n"
        preview += f"   • Character Count: {len(body)}\n"
        preview += f"   • Estimated Read Time: {max(1, len(body.split()) // 200)} minute(s)\n"
        
        return preview
    
    def format_email_summary(self, emails: List[Dict]) -> str:
        """Generate a summary of all email previews."""
        if not emails:
            return "No emails to preview."
        
        summary = f"\n📊 EMAIL SUMMARY ({len(emails)} emails)\n"
        summary += "=" * 30 + "\n"
        
        # Count by priority
        priority_counts = {}
        dept_counts = {}
        
        for email in emails:
            priority = email.get('priority', 'MEDIUM').upper()
            dept = email.get('to', '').split('@')[0] if '@' in email.get('to', '') else 'unknown'
            
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
            dept_counts[dept] = dept_counts.get(dept, 0) + 1
        
        # Priority breakdown
        summary += "BY PRIORITY:\n"
        for priority, count in priority_counts.items():
            emoji = {'CRITICAL': '🚨', 'HIGH': '⚠️', 'MEDIUM': '📋', 'LOW': '📝'}.get(priority, '📋')
            summary += f"  {emoji} {priority}: {count} email(s)\n"
        
        # Department breakdown  
        summary += "\nBY DEPARTMENT:\n"
        for dept, count in dept_counts.items():
            emoji = {'engineering': '🔧', 'pr': '📢', 'support': '🎧', 'management': '👔'}.get(dept, '📧')
            summary += f"  {emoji} {dept}: {count} email(s)\n"
        
        return summary