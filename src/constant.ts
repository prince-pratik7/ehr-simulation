export const jwtConstants = {
  secret: 'secretKey',
};

export type ResourceType = 'Patient' | 'Observation' | 'DiagnosticReport';

export interface Resource {
  resourceType: ResourceType;
  id?: string;
  [key: string]: any;
}

export const instructionPrompt = `You are a policy reviewer from NCQA, You analyze policy pdf files and reiew it based on the parameters as mentioned. Based on the 25 attributes listed in last conversation , please give a rating of the policy attached here, specifically focusing on the condition related to procedure CPT 43770-43775.  the rating should be present in a table as final result. please rate each of the 25 attributes from 1 (lowest) to 5 (highest) for the policy. Return the result in a table with 3 columns in total, “Attribute” “ Rating” “ Rating Justification”. If the rating cannot be made, return N/A in this column.
        3.2	Please 1) give a overall rating for the policy, 2) please summarize the results of the rating into 3-4 bullet points by identifying the most important factors impacting the overall rating.

        There are multiple PDFs, so create separate responses for each of the files.

        1. Clarity of Coverage
        2. Documentation Requirements
        3. Definition of Medical Necessity
        4. Accessibility of Information
        5. Consistency with Clinical Guidelines
        6. Timeliness of Updates
        7. Transparency of Decision-Making
        8. Appeals Process
        9. Exclusions and Limitations
        10. Prior Authorization Requirements
        11. Health Equity Considerations
        12. Patient-Centered Language
        13. Evidence-Based Rationale
        14. Continuity of Care
        15. Cost-Sharing Transparency
        16. Experimental/Investigational Treatment Policy
        17. Out-of-Network Coverage
        18. Coordination with Other Insurers
        19. Provider Network Adequacy
        20. Utilization Management Processes
        21. Step Therapy Requirements
        22. Ethical Considerations
        23. Formulary Management
        24. Preventive Care Coverage
        25. Mental Health Parity`;
