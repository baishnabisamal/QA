# Lab III.5 — Test Automation with Playwright

## Lab Overview
- Builds an automated end-to-end (E2E) test suite using Playwright with the Page Object Model (POM) pattern
- Automates Instasafe's MFA login, device/resource browsing, policy/cart assignment, and logout flows
- Suite runs in both headed and headless modes
- Produces an HTML test report

## Note on Environment
- demo.instasafe.com was not accessible — staging credentials were not provisioned at the time of this lab
- Suite was instead built and validated against **practicesoftwaretesting.com** as a stand-in test target
- Framework is fully environment-agnostic — locators, page objects, and assertions are written generically
- To point this exact suite at Instasafe staging, only `.env` needs to change (`BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`, `TOTP_SECRET`)
- No test logic requires modification to switch environments

## Tech Stack
- Playwright + TypeScript
- Page Object Model (POM) pattern
- dotenv for environment/secrets management
- otpauth for programmatic TOTP generation

## Evidence

## HTML report showing all 13 tests passing

<img width="994" height="859" alt="Screenshot (449)" src="https://github.com/user-attachments/assets/6258143b-a8c0-4da2-90ca-f69f017a88ac" />

<img width="981" height="913" alt="Screenshot (450)" src="https://github.com/user-attachments/assets/756483ae-2eae-44ef-bfa1-1c3b02d17407" />

## The intentional failure screenshot

<img width="1920" height="968" alt="Screenshot (452)" src="https://github.com/user-attachments/assets/92b1e370-f1c0-46c8-be32-969618f578d2" />

<img width="1152" height="618" alt="Screenshot (451)" src="https://github.com/user-attachments/assets/978afeb3-9f51-421e-a652-8000571cfb66" />

## Trace viewer screenshot
<img width="1920" height="926" alt="Screenshot (455)" src="https://github.com/user-attachments/assets/9866d7e2-e6ce-4dd4-8a8d-0818f31ba2a6" />
