# AGENTS.md - Smart Campus Room Availability Checker

## 1. Project Overview
This project is a room availability checker developed with React, TypeScript, and Vitest.

The application allows users to select a time interval and check whether a study room is available based on existing bookings and room status.

The goal is to maintain clean, reusable, testable code while preserving existing functionality.

## 2. Project Structure
- `src/App.tsx` - Application state, user inputs, and main interface.
- `src/lib/availability.ts` - Booking validation and availability logic.
- `src/lib/format.ts` - Time formatting utilities.
- `src/components/` - Reusable interface components.
- `src/lib/__tests__/` - Unit and regression tests.

Respect the existing structure. Do not reorganize folders without a clear reason.

## 3. Coding Guidelines
- Use TypeScript with clear and consistent types.
- Follow the existing naming conventions and code style.
- Keep functions small and focused on one responsibility.
- Separate business logic from UI components.
- Prefer reusable functions over duplicated code.
- Reuse existing constants instead of hardcoding values.
- Keep availability calculations pure and avoid modifying input arrays.
- Handle invalid inputs and boundary cases explicitly.
- Avoid unnecessary dependencies, abstractions, and complex design patterns.

## 4. Refactoring Rules
Before making changes:
1. Inspect only the files relevant to the requested task.
2. Identify the actual maintainability problem.
3. Select the smallest safe improvement.
4. Consider how the change affects existing callers and tests.

During refactoring:
- Preserve the existing booking rules and user-visible behavior.
- Do not change public function signatures unnecessarily.
- Do not rewrite unrelated components.
- Avoid introducing new features.
- Use design patterns only when they provide a clear benefit.
- Prefer simple techniques such as Extract Function and Replace Magic Number with Constant.

After refactoring:
- Confirm that the original functionality remains unchanged.
- Check that no new duplication or unnecessary complexity was introduced.

## 5. Testing and Verification
- Use the existing Vitest tests to detect regressions.
- Preserve existing passing tests.
- Add focused tests for changed behavior or uncovered edge cases.
- Verify time validation, booking conflicts, blocked rooms, and boundary conditions.
- Ensure input data is not mutated.
- Preserve clear UI feedback and responsive design.
- Run relevant tests after changes.

Never report tests as passed unless they were actually executed successfully.

## 6. AI Agent Behavior
When assisting with this project:
- Follow the instructions in this file.
- Explain the intended change briefly before implementing it.
- Modify only files necessary for the task.
- Avoid broad rewrites and unnecessary project-wide searches.
- Prefer concise responses to reduce token usage.
- Report changed files and the reason for each change.
- Report actual test results and any remaining issues.
- Ask for clarification only when a missing requirement prevents safe implementation.

## 7. Restrictions
Do not:
- Remove existing functionality.
- Change booking rules without an explicit request.
- Modify unrelated files.
- Introduce new packages without justification.
- Add design patterns solely for demonstration.
- Replace existing tests with weaker tests.
- Claim unverified results or completed work.

## 8. Completion Criteria
A refactoring task is complete when:
1. The identified maintainability issue is addressed.
2. Existing application behavior is preserved.
3. Relevant automated tests pass.
4. Changes are minimal and understandable.
5. The final response summarizes modifications, verification results, and limitations.