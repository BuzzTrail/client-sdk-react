import React from 'react';
import type { WidgetConfig } from '../../types';

interface BuzzTrailConfigurationSectionProps {
  config: WidgetConfig;
  updateConfig: (key: keyof WidgetConfig, value: any) => void;
}

const BuzzTrailConfigurationSection: React.FC<BuzzTrailConfigurationSectionProps> = ({
  config,
  updateConfig,
}) => {
  const handleAssistantOverridesChange = (field: string, value: string) => {
    const newOverrides = {
      ...config.assistantOverrides,
      variableValues: {
        ...config.assistantOverrides?.variableValues,
        [field]: value,
      },
    };
    updateConfig('assistantOverrides', newOverrides);
  };

  const handleAssistantObjectChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      updateConfig('assistant', parsed);
    } catch (error) {
      // Keep the string value for editing, but don't update the object
      console.warn('Invalid JSON for assistant object');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          BuzzTrail Configuration
        </h2>
      </div>
      <p className="text-sm mb-6 text-gray-600">
        Configure how the widget connects to BuzzTrail AI. Provide at least one
        configuration option.
      </p>

      {/* Public Key */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          BuzzTrail Public Key *
          <svg
            className="w-3 h-3 inline ml-1 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </label>
        <input
          type="text"
          value={config.publicKey}
          onChange={(e) => updateConfig('publicKey', e.target.value)}
          className="w-full p-2 rounded-md border bg-white border-gray-300 text-gray-900 font-mono text-sm"
          placeholder="your-buzztrail-public-key"
        />
        <p className="text-xs mt-1 text-gray-500">
          Get your public key from your BuzzTrail dashboard
        </p>
      </div>

      {/* Configuration Fields */}
      <div className="space-y-6">
        {/* Assistant ID */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Assistant ID
            <span className="text-xs text-gray-500 ml-2">(Voice + Chat)</span>
          </label>
          <input
            type="text"
            value={config.assistantId || ''}
            onChange={(e) => updateConfig('assistantId', e.target.value)}
            className="w-full p-2 rounded-md border bg-white border-gray-300 text-gray-900 font-mono text-sm"
            placeholder="your-assistant-id"
          />
          <p className="text-xs mt-1 text-gray-500">
            Simple assistant ID that works with both voice and chat modes
          </p>
        </div>

        {/* Assistant Overrides */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Assistant Overrides
            <span className="text-xs text-gray-500 ml-2">(Voice + Chat)</span>
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600">
                Variable: name
              </label>
              <input
                type="text"
                value={config.assistantOverrides?.variableValues?.name || ''}
                onChange={(e) =>
                  handleAssistantOverridesChange('name', e.target.value)
                }
                className="w-full p-2 rounded-md border bg-white border-gray-300 text-gray-900 text-sm"
                placeholder="John"
              />
            </div>
          </div>
          <p className="text-xs mt-1 text-gray-500">
            Custom variable values to pass to the assistant
          </p>
        </div>

        {/* Assistant Object */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Full Assistant Configuration
            <span className="text-xs text-red-500 ml-2">(Voice Only)</span>
          </label>
          <textarea
            value={JSON.stringify(config.assistant, null, 2)}
            onChange={(e) => handleAssistantObjectChange(e.target.value)}
            rows={12}
            className="w-full p-2 rounded-md border bg-white border-gray-300 text-gray-900 font-mono text-sm"
            placeholder='{"model": {"provider": "openai", "model": "gpt-4-1-mini"}}'
          />
          <p className="text-xs mt-1 text-gray-500">
            Complete assistant configuration object (only used for voice calls)
          </p>
        </div>

        {/* First Chat Message */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            First Chat Message
            <span className="text-xs text-gray-500 ml-2">(Chat Only)</span>
          </label>
          <input
            type="text"
            id="first-chat-message"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={config.chatFirstMessage || ''}
            onChange={(e) => updateConfig('chatFirstMessage', e.target.value)}
            placeholder="Hi! How can I help you today?"
          />
          <p className="text-xs mt-1 text-gray-500">
            The initial message displayed when the chat opens
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuzzTrailConfigurationSection;
