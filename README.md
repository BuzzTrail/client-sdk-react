# BUZZTRAIL React Client SDK

> ⚠️ **Beta Version**: This library is currently in beta. APIs may change and some features might be unstable. Use with caution in production environments.

A modern React component library with embeddable voice and chat widgets built with Vite, TypeScript, and Tailwind CSS. Featuring seamless BUZZTRAIL AI integration for voice conversations.

## Features

- 🎙️ **Voice Conversations**: Real-time voice calls with BUZZTRAIL AI assistants
- 💬 **Chat Interface**: Text-based conversations with markdown support
- 🔀 **Hybrid Mode**: Seamlessly switch between voice and chat
- 🎨 **Highly Customizable**: Themes, colors, sizes, and positions
- 🔒 **Consent Management**: Built-in consent form for compliance
- ⚡ **Easy Integration**: Use as React component or embed in any HTML page
- 📘 **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install @buzztrail-ai/client-sdk-react @vapi-ai/web
```

> **Note**: `@vapi-ai/web` is a peer dependency that must be installed separately to avoid WebRTC connection conflicts.

## Quick Start

The simplest way to add the widget to your website:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@buzztrail-ai/client-sdk-react/dist/embed/widget.umd.js"></script>
  </head>
  <body>
    <buzztrail-widget
      public-key="your-buzztrail-public-key"
      assistant-id="your-assistant-id"
      mode="chat"
      theme="light"
      size="full"
      color-accent="#3B82F6"
      cta-button-color="#1F2937"
      cta-button-text-color="#FFFFFF"
      title="AI Assistant"
      cta-title="Chat with us"
      cta-subtitle="24/7 Support"
      chat-placeholder="How can I help you today?"
    ></buzztrail-widget>
  </body>
</html>
```

## BuzzTrailWidget Props

### Required Props

| Prop        | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| `publicKey` | `string` | Your BUZZTRAIL public API key |

### BUZZTRAIL Configuration Props

| Prop                 | Type     | Description                                               |
| -------------------- | -------- | --------------------------------------------------------- |
| `assistantId`        | `string` | BUZZTRAIL assistant ID (supported by both voice and chat) |
| `assistant`          | `object` | Full assistant configuration object (voice only)          |
| `assistantOverrides` | `object` | Assistant overrides (supported by both voice and chat)    |

> **Note**: You must provide at least one of `assistantId`, `assistant`, or both `assistantId` and `assistantOverrides`.

### Optional Props

| Prop                      | Type                                                                                                 | Default                      | Description                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------- |
| `mode`                    | `'voice' \| 'chat' \| 'hybrid'`                                                                      | `'chat'`                     | Widget interaction mode            |
| `theme`                   | `'light' \| 'dark'`                                                                                  | `'light'`                    | Color theme                        |
| `position`                | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' \| 'bottom-center' \| 'center-center'` | `'bottom-right'`             | Screen position                    |
| `size`                    | `'tiny' \| 'compact' \| 'full'`                                                                      | `'full'`                     | Widget size                        |
| `borderRadius`            | `'none' \| 'small' \| 'medium' \| 'large'`                                                           | `'medium'`                   | Corner radius style                |
| `apiUrl`                  | `string`                                                                                             | -                            | Custom API endpoint for chat mode  |
| **Colors**                |                                                                                                      |                              |                                    |
| `baseBgColor`             | `string`                                                                                             | -                            | Main background color              |
| `accentColor`             | `string`                                                                                             | `'#14B8A6'`                  | Primary accent color               |
| `ctaButtonColor`          | `string`                                                                                             | `'#000000'`                  | CTA button background color        |
| `ctaButtonTextColor`      | `string`                                                                                             | `'#FFFFFF'`                  | CTA button text/icon color         |
| **Text Labels**           |                                                                                                      |                              |                                    |
| `title`                   | `string`                                                                                             | `'Talk with AI'`             | Main widget title                  |
| `startButtonText`         | `string`                                                                                             | `'Start'`                    | Voice call start button text       |
| `endButtonText`           | `string`                                                                                             | `'End Call'`                 | Voice call end button text         |
| `ctaTitle`                | `string`                                                                                             | _(uses title)_               | Floating button main text          |
| `ctaSubtitle`             | `string`                                                                                             | -                            | Floating button subtitle text      |
| **Empty States**          |                                                                                                      |                              |                                    |
| `voiceEmptyMessage`       | `string`                                                                                             | -                            | Message when voice mode is empty   |
| `voiceActiveEmptyMessage` | `string`                                                                                             | -                            | Message during active voice call   |
| `chatEmptyMessage`        | `string`                                                                                             | -                            | Message when chat is empty         |
| `hybridEmptyMessage`      | `string`                                                                                             | -                            | Message for hybrid mode            |
| **Chat Configuration**    |                                                                                                      |                              |                                    |
| `chatFirstMessage`        | `string`                                                                                             | -                            | Initial assistant message in chat  |
| `chatPlaceholder`         | `string`                                                                                             | `'Type your message...'`     | Chat input placeholder text        |
| **Voice Configuration**   |                                                                                                      |                              |                                    |
| `voiceShowTranscript`     | `boolean`                                                                                            | `false`                      | Show/hide voice transcript         |
| **Consent Configuration** |                                                                                                      |                              |                                    |
| `consentRequired`         | `boolean`                                                                                            | `false`                      | Show consent form before first use |
| `consentTitle`            | `string`                                                                                             | `"Terms and conditions"`     | Consent form title                 |
| `consentContent`          | `string`                                                                                             | _(default message)_          | Terms & conditions content         |
| `consentStorageKey`       | `string`                                                                                             | `"buzztrail_widget_consent"` | Key for storing consent            |

### Event Callbacks

| Prop           | Type                     | Description                      |
| -------------- | ------------------------ | -------------------------------- |
| `onVoiceStart` | `() => void`             | Triggered when voice call starts |
| `onVoiceEnd`   | `() => void`             | Triggered when voice call ends   |
| `onMessage`    | `(message: any) => void` | Triggered for all messages       |
| `onError`      | `(error: Error) => void` | Triggered on errors              |

## React Component Usage

If you're using React, you can import and use the widget as a component:

```tsx
import { BuzzTrailWidget } from '@buzztrail-ai/client-sdk-react';

function App() {
  return (
    <BuzzTrailWidget
      publicKey="your-buzztrail-public-key"
      assistantId="your-assistant-id"
      mode="hybrid"
      position="bottom-right"
      theme="light"
      accentColor="#3B82F6"
      title="AI Assistant"
      chatPlaceholder="Ask me anything..."
      voiceShowTranscript={true}
    />
  );
}
```

## Embedding Methods

### 1. Custom Element (Recommended)

Use the widget as a custom HTML element with kebab-case attributes - the cleanest and most modern approach:

```html
<buzztrail-widget
  public-key="pk_123"
  assistant-id="asst_456"
  mode="chat"
  theme="dark"
  accent-color="#8B5CF6"
  consent-required="true"
  chat-first-message="Welcome! How can I assist you?"
  chat-placeholder="Type your question here..."
></buzztrail-widget>
```

### 2. Data Attributes

Use this approach if your environment doesn't support custom elements or for better compatibility with older systems:

```html
<div
  data-client-widget="BuzzTrailWidget"
  data-public-key="pk_123"
  data-assistant-id="asst_456"
  data-mode="voice"
  data-theme="dark"
  data-size="compact"
></div>
```

## Usage Examples

### Voice-Only Mode

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  mode="voice"
  size="tiny"
  voiceShowTranscript={false}
  startButtonText="Call"
  endButtonText="Hang Up"
/>
```

### Chat-Only Mode

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  mode="chat"
  theme="dark"
  accentColor="#8B5CF6"
  chatFirstMessage="Hello! How can I help you today?"
  chatPlaceholder="Type your message here..."
/>
```

### Hybrid Mode with Assistant Overrides

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  assistantOverrides={{
    variableValues: { name: 'John' },
  }}
  mode="hybrid"
  consentRequired={true}
  consentTitle="Privacy Agreement"
  consentContent="By using this service, you agree to our terms..."
  title="Support Assistant"
  hybridEmptyMessage="Start a conversation with voice or text"
  onMessage={(msg) => console.log('Message:', msg)}
/>
```

### Voice-Only with Full Assistant Object

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistant={{
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
    },
    voice: {
      provider: '11labs',
      voiceId: 'burt',
    },
  }}
  mode="voice"
  size="full"
/>
```

### Custom Styling

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  baseBgColor="#1a1a1a"
  accentColor="#ff6b6b"
  ctaButtonColor="#2a2a2a"
  ctaButtonTextColor="#ffffff"
  borderRadius="large"
  size="full"
  title="Premium Support"
/>
```

### Floating Button with Custom CTA

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  mode="hybrid"
  position="bottom-center"
  title="Customer Support Portal"
  ctaTitle="Need Help?"
  ctaSubtitle="Chat with our AI assistant"
  accentColor="#10b981"
  size="full"
/>
```

### Centered Widget

```tsx
<BuzzTrailWidget
  publicKey="pk_123"
  assistantId="asst_456"
  mode="chat"
  position="center-center"
  theme="dark"
  accentColor="#8B5CF6"
  size="full"
  title="AI Assistant"
  chatFirstMessage="Hello! How can I help you today?"
/>
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/BuzzTrailAI/client-sdk-react.git
cd client-sdk-react

# Install dependencies
npm install

# Build everything
npm run build:all
```

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build React library
- `npm run build:widget` - Build embeddable widget
- `npm run build:all` - Build both library and widget
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

### Running the Example

```bash
cd example
npm install
npm run dev
```

Visit <http://localhost:5173> to see the example app.

## Browser Support

- Chrome/Edge 79+
- Firefox 86+
- Safari 14.1+
- Mobile browsers with WebRTC support

## Requirements

- Microphone access for voice mode
- HTTPS required in production
- BUZZTRAIL account and API key

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- [Documentation](https://docs.buzztrail.ai)
- [BUZZTRAIL Dashboard](https://dashboard.buzztrail.ai)
- [Issues](https://github.com/BuzzTrailAI/client-sdk-react/issues)
