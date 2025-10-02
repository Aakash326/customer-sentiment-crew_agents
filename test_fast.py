#!/usr/bin/env python3
"""
Quick test script for the Fast Workflow.
"""
import asyncio
import json
from workflows.fast_workflow import FastWorkflow

def test_fast_workflow():
    """Test the fast workflow with a sample company."""
    print("🚀 Testing Fast Workflow...")
    print("=" * 50)
    
    # Initialize the fast workflow
    fast_workflow = FastWorkflow()
    
    # Test with Apple
    company_name = "Apple"
    print(f"Analyzing: {company_name}")
    print("This will take 10-15 seconds...")
    print()
    
    try:
        # Run the workflow
        results = fast_workflow.run(company_name)
        
        # Display results
        print("✅ Fast Workflow Results:")
        print("=" * 50)
        print(f"Status: {results.get('status')}")
        print(f"Company: {results.get('company')}")
        print(f"Agents Used: {results.get('agents_used')}")
        print(f"Processing Time: {results.get('processing_time')}")
        print(f"Performance: {results.get('performance', {}).get('performance_rating')}")
        print()
        
        # Show crew output (this contains the actual analysis and email previews)
        crew_output = results.get('crew_output', 'No output available')
        print("📋 Detailed Analysis & Email Previews:")
        print("-" * 50)
        print(crew_output)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure you have:")
        print("1. Valid API keys in .env file")
        print("2. Internet connection for Tavily search")
        print("3. All dependencies installed")

if __name__ == "__main__":
    test_fast_workflow()