# Rebuilding Highly Detailed Document Forms

The user's core issue is that the React UI Forms (e.g., `ArticlesOfAssociationForm.tsx`, `MOAForm.tsx`) are currently too simplified. They do not capture the exhaustive list of conditions and variables defined in the highly professional system prompts the user provided earlier in the chat. As a result, the generated documents lack the deep structure and precision expected.

## Proposed Changes

I will redesign the React forms to capture every single variable specified in the user's JSON structures. 

### 1. `client/src/pages/documents/corporate/ArticlesOfAssociationForm.tsx`
[MODIFY] `ArticlesOfAssociationForm.tsx`
- Add fields for: `cin`, `registered_office_state`, `effective_date`, `paid_up_share_capital`, `share_classes`.
- Add text/select inputs for: `director_categories`, `quorum_requirements`, `voting_rights`, `dividend_policy`.
- Add checkboxes for: `listed_company`, `section8_company`, `foreign_shareholders`, `arbitration_clause`.
- Update `fillDummyData` to pre-populate all these new fields with rich, professional dummy data.

### 2. `server/prompts/corporate/aoa.ts`
[MODIFY] `aoa.ts`
- Ensure the serializer correctly receives and formats these new fields from the expanded React form so they exactly match the `Structured JSON will include:` keys in the system prompt.

### 3. Expand to Other Forms
Once the AOA form is rebuilt and approved as the standard, I will proceed to rewrite the other critical forms (like `MOAForm.tsx`, `ServiceAgreementForm.tsx`, etc.) to match this exact level of exhaustive detail.

## User Review Required
Does this comprehensive form expansion strategy address your concern? If you approve, I will immediately begin rewriting the AOA form to include all the missing detailed inputs.
