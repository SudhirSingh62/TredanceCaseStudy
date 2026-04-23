import { AutomationAction } from '../types/workflow';

// Mock data representing available backend automation actions
const MOCK_AUTOMATIONS: AutomationAction[] = [
  {
    id: 'send_email',
    name: 'Send Email Notification',
    description: 'Sends an automated email to a specified address.',
    params: [
      { key: 'to', label: 'Recipient Email', type: 'string' },
      { key: 'subject', label: 'Subject Line', type: 'string' },
    ],
  },
  {
    id: 'create_jira_ticket',
    name: 'Create Jira Task',
    description: 'Creates a task in Jira for the IT team.',
    params: [
      { key: 'projectKey', label: 'Project Key (e.g. IT)', type: 'string' },
      { key: 'issueType', label: 'Issue Type', type: 'string' },
    ],
  },
  {
    id: 'verify_documents',
    name: 'Verify Employee Documents',
    description: 'Calls an external background check service.',
    params: [
      { key: 'documentType', label: 'Document Type', type: 'string' },
    ],
  },
];

export const api = {
  /**
   * Fetches the available automated actions that can be used in "Automated Nodes"
   */
  getAutomations: async (): Promise<AutomationAction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_AUTOMATIONS), 600); // Simulate network latency
    });
  },

  /**
   * Simulates executing a specific automated action.
   */
  simulateAction: async (actionId: string, params: Record<string, string>): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly succeed or fail to show dynamic simulation (80% success rate)
        const isSuccess = Math.random() > 0.2;
        if (isSuccess) {
          resolve({ success: true, message: `Successfully executed action: ${actionId}` });
        } else {
          resolve({ success: false, message: `Action failed: ${actionId} timeout.` });
        }
      }, 1000);
    });
  }
};
