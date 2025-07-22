import React, { useState, useEffect, useRef } from 'react';
import { useBuzzTrailWidget } from '../hooks';

import { BuzzTrailWidgetProps, ColorScheme, StyleConfig } from './types';

import { sizeStyles, radiusStyles, positionStyles } from './constants';

import ConsentForm from './widget/ConsentForm';
import FloatingButton from './widget/FloatingButton';
import WidgetHeader from './widget/WidgetHeader';
import AnimatedStatusIcon from './AnimatedStatusIcon';
import ConversationMessage from './widget/conversation/Message';
import EmptyConversation from './widget/conversation/EmptyState';
import VoiceControls from './widget/controls/VoiceControls';
import ChatControls from './widget/controls/ChatControls';
import HybridControls from './widget/controls/HybridControls';

import '../styles/animations.css';

const BuzzTrailWidget: React.FC<BuzzTrailWidgetProps> = ({
  publicKey,
  assistantId,
  assistant,
  assistantOverrides,
  apiUrl,
  position = 'bottom-right',
  size = 'full',
  borderRadius,
  radius = 'medium', // deprecated
  mode = 'chat',
  theme = 'light',
  // Colors
  baseBgColor,
  baseColor, // deprecated
  accentColor,
  ctaButtonColor,
  buttonBaseColor, // deprecated
  ctaButtonTextColor,
  buttonAccentColor, // deprecated
  // Text labels
  title,
  mainLabel, // deprecated
  startButtonText,
  endButtonText,
  ctaTitle,
  ctaSubtitle,
  // Empty messages
  voiceEmptyMessage,
  emptyVoiceMessage = 'Click the start button to begin a conversation', // deprecated
  voiceActiveEmptyMessage,
  emptyVoiceActiveMessage = 'Listening...', // deprecated
  chatEmptyMessage,
  emptyChatMessage = 'Type a message to start chatting', // deprecated
  hybridEmptyMessage,
  emptyHybridMessage = 'Use voice or text to communicate', // deprecated
  // Chat configuration
  chatFirstMessage,
  firstChatMessage, // deprecated
  chatPlaceholder,
  // Voice configuration
  voiceShowTranscript,
  showTranscript = false, // deprecated
  // Consent configuration
  consentRequired,
  requireConsent = false, // deprecated
  consentTitle,
  consentContent,
  termsContent = 'By clicking "Agree," and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service.', // deprecated
  consentStorageKey,
  localStorageKey = 'buzztrail_widget_consent', // deprecated
  // Event handlers
  onVoiceStart,
  onCallStart, // deprecated
  onVoiceEnd,
  onCallEnd, // deprecated
  onMessage,
  onError,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const conversationEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveBorderRadius = borderRadius ?? radius;
  const effectiveBaseBgColor = baseBgColor ?? baseColor;
  const effectiveAccentColor = accentColor ?? '#14B8A6';
  const effectiveColorButtonBase =
    buttonBaseColor ?? ctaButtonColor ?? '#000000';
  const effectiveColorButtonAccent =
    buttonAccentColor ?? ctaButtonTextColor ?? '#FFFFFF';
  const effectiveTextWidgetTitle = title ?? mainLabel ?? 'Talk with AI';
  const effectiveCtaTitle = ctaTitle ?? effectiveTextWidgetTitle;
  const effectiveCtaSubtitle = ctaSubtitle;
  const effectiveStartButtonText = startButtonText ?? 'Start';
  const effectiveEndButtonText = endButtonText ?? 'End Call';
  const effectiveVoiceEmptyMessage = voiceEmptyMessage ?? emptyVoiceMessage;
  const effectiveVoiceActiveEmptyMessage =
    voiceActiveEmptyMessage ?? emptyVoiceActiveMessage;
  const effectiveChatEmptyMessage = chatEmptyMessage ?? emptyChatMessage;
  const effectiveHybridEmptyMessage = hybridEmptyMessage ?? emptyHybridMessage;
  const effectiveChatFirstMessage = chatFirstMessage ?? firstChatMessage;
  const effectiveVoiceShowTranscript = voiceShowTranscript ?? showTranscript;
  const effectiveConsentRequired = consentRequired ?? requireConsent;
  const effectiveConsentTitle = consentTitle;
  const effectiveConsentContent = consentContent ?? termsContent;
  const effectiveConsentStorageKey = consentStorageKey ?? localStorageKey;
  const effectiveOnVoiceStart = onVoiceStart ?? onCallStart;
  const effectiveOnVoiceEnd = onVoiceEnd ?? onCallEnd;
  const effectiveChatPlaceholder = chatPlaceholder ?? 'Type your message...';

  const buzztrail = useBuzzTrailWidget({
    mode,
    publicKey,
    assistantId,
    assistant,
    assistantOverrides,
    apiUrl,
    firstChatMessage: effectiveChatFirstMessage,
    onCallStart: effectiveOnVoiceStart,
    onCallEnd: effectiveOnVoiceEnd,
    onMessage,
    onError,
  });

  const colors: ColorScheme = {
    baseColor: effectiveBaseBgColor
      ? theme === 'dark' && effectiveBaseBgColor === '#FFFFFF'
        ? '#000000'
        : effectiveBaseBgColor
      : theme === 'dark'
        ? '#000000'
        : '#FFFFFF',
    accentColor: effectiveAccentColor,
    ctaButtonColor: effectiveColorButtonBase,
    ctaButtonTextColor: effectiveColorButtonAccent,
  };

  const effectiveSize = mode !== 'voice' && size === 'tiny' ? 'compact' : size;
  const styles: StyleConfig = {
    size: effectiveSize,
    radius: effectiveBorderRadius,
    theme,
  };

  const showExpandedView = isExpanded && !(mode === 'voice' && size === 'tiny');

  const getExpandedWidgetStyle = (): React.CSSProperties => ({
    ...sizeStyles[size].expanded,
    ...radiusStyles[radius],
    backgroundColor: colors.baseColor,
    border: `1px solid ${styles.theme === 'dark' ? '#1F2937' : '#E5E7EB'}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow:
      styles.theme === 'dark'
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  });

  const getConversationAreaStyle = (): React.CSSProperties => ({
    flex: '1 1 0%',
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: colors.baseColor,
    ...(styles.theme === 'dark' ? { filter: 'brightness(1.1)' } : {}),
  });

  const getControlsAreaStyle = (): React.CSSProperties => ({
    padding: '1rem',
    borderTop: `1px solid ${styles.theme === 'dark' ? '#1F2937' : '#E5E7EB'}`,
    backgroundColor: colors.baseColor,
    ...(styles.theme === 'dark'
      ? { filter: 'brightness(1.05)' }
      : { filter: 'brightness(0.97)' }),
  });

  const getConversationLayoutStyle = (): React.CSSProperties => {
    const isEmpty = buzztrail.conversation.length === 0;
    const hideTranscript =
      !effectiveVoiceShowTranscript &&
      buzztrail.voice.isCallActive &&
      (mode === 'voice' || mode === 'hybrid');
    const showingEmptyState = mode === 'voice' && !buzztrail.voice.isCallActive;

    if (isEmpty || hideTranscript || showingEmptyState) {
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };
    }

    return {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    };
  };

  useEffect(() => {
    if (effectiveConsentRequired) {
      const storedConsent = localStorage.getItem(effectiveConsentStorageKey);
      const hasStoredConsent = storedConsent === 'true';
      setHasConsent(hasStoredConsent);
    } else {
      setHasConsent(true);
    }
  }, [effectiveConsentRequired, effectiveConsentStorageKey]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [buzztrail.conversation, buzztrail.chat.isTyping]);

  useEffect(() => {
    if (isExpanded && (mode === 'chat' || mode === 'hybrid')) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isExpanded, mode]);

  const handleConsentAgree = () => {
    localStorage.setItem(effectiveConsentStorageKey, 'true');
    setHasConsent(true);
  };

  const handleConsentCancel = () => {
    setIsExpanded(false);
  };

  const handleToggleCall = async () => {
    await buzztrail.voice.toggleCall();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const message = chatInput.trim();
    setChatInput('');

    await buzztrail.chat.sendMessage(message);
    inputRef.current?.focus();
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChatInput(value);
    buzztrail.chat.handleInput(value);
  };

  const handleReset = () => {
    buzztrail.clearConversation();

    if (buzztrail.voice.isCallActive) {
      buzztrail.voice.endCall();
    }

    setChatInput('');

    if (mode === 'chat' || mode === 'hybrid') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleFloatingButtonClick = () => {
    setIsExpanded(true);
  };

  const renderConversationMessages = () => {
    if (buzztrail.conversation.length === 0) {
      return (
        <EmptyConversation
          mode={mode}
          isCallActive={buzztrail.voice.isCallActive}
          theme={styles.theme}
          voiceEmptyMessage={effectiveVoiceEmptyMessage}
          voiceActiveEmptyMessage={effectiveVoiceActiveEmptyMessage}
          chatEmptyMessage={effectiveChatEmptyMessage}
          hybridEmptyMessage={effectiveHybridEmptyMessage}
        />
      );
    }

    return (
      <>
        {buzztrail.conversation.map((message, index) => {
          try {
            const key = message?.id || `${message.role}-${index}`;
            return (
              <ConversationMessage
                key={key}
                role={message.role}
                content={message.content || ''}
                colors={colors}
                styles={styles}
                isLoading={
                  index === buzztrail.conversation.length - 1 &&
                  message.role === 'assistant' &&
                  buzztrail.chat.isTyping
                }
              />
            );
          } catch (error) {
            console.error('Error rendering message:', error, message);
            return null;
          }
        })}
        <div ref={conversationEndRef} />
      </>
    );
  };

  const renderConversationArea = () => {
    // Chat mode: always show conversation messages
    if (mode === 'chat') {
      return renderConversationMessages();
    }

    // Hybrid mode: show messages when call is not active, respect showTranscript when active
    if (mode === 'hybrid') {
      if (!buzztrail.voice.isCallActive) {
        return renderConversationMessages();
      } else if (effectiveVoiceShowTranscript) {
        return renderConversationMessages();
      } else {
        return (
          <AnimatedStatusIcon
            size={150}
            connectionStatus={buzztrail.voice.connectionStatus}
            isCallActive={buzztrail.voice.isCallActive}
            isSpeaking={buzztrail.voice.isSpeaking}
            isTyping={buzztrail.chat.isTyping}
            volumeLevel={buzztrail.voice.volumeLevel}
            baseColor={colors.accentColor}
            colors={colors.accentColor}
          />
        );
      }
    }

    // Voice mode: respect showTranscript when call is active
    if (mode === 'voice') {
      if (buzztrail.voice.isCallActive) {
        if (effectiveVoiceShowTranscript) {
          return renderConversationMessages();
        } else {
          return (
            <AnimatedStatusIcon
              size={150}
              connectionStatus={buzztrail.voice.connectionStatus}
              isCallActive={buzztrail.voice.isCallActive}
              isSpeaking={buzztrail.voice.isSpeaking}
              isTyping={buzztrail.chat.isTyping}
              volumeLevel={buzztrail.voice.volumeLevel}
              baseColor={colors.accentColor}
              colors={colors.accentColor}
            />
          );
        }
      }
    }

    // Default: show empty conversation
    return (
      <EmptyConversation
        mode={mode}
        isCallActive={buzztrail.voice.isCallActive}
        theme={styles.theme}
        voiceEmptyMessage={effectiveVoiceEmptyMessage}
        voiceActiveEmptyMessage={effectiveVoiceActiveEmptyMessage}
        chatEmptyMessage={effectiveChatEmptyMessage}
        hybridEmptyMessage={effectiveHybridEmptyMessage}
      />
    );
  };

  const renderControls = () => {
    if (mode === 'voice') {
      return (
        <VoiceControls
          isCallActive={buzztrail.voice.isCallActive}
          connectionStatus={buzztrail.voice.connectionStatus}
          isAvailable={buzztrail.voice.isAvailable}
          onToggleCall={handleToggleCall}
          startButtonText={effectiveStartButtonText}
          endButtonText={effectiveEndButtonText}
          colors={colors}
        />
      );
    }

    if (mode === 'chat') {
      return (
        <ChatControls
          chatInput={chatInput}
          isAvailable={buzztrail.chat.isAvailable}
          onInputChange={handleChatInputChange}
          onSendMessage={handleSendMessage}
          colors={colors}
          styles={styles}
          inputRef={inputRef}
          placeholder={effectiveChatPlaceholder}
        />
      );
    }

    if (mode === 'hybrid') {
      return (
        <HybridControls
          chatInput={chatInput}
          isCallActive={buzztrail.voice.isCallActive}
          connectionStatus={buzztrail.voice.connectionStatus}
          isChatAvailable={buzztrail.chat.isAvailable}
          isVoiceAvailable={buzztrail.voice.isAvailable}
          onInputChange={handleChatInputChange}
          onSendMessage={handleSendMessage}
          onToggleCall={handleToggleCall}
          colors={colors}
          styles={styles}
          inputRef={inputRef}
          placeholder={effectiveChatPlaceholder}
        />
      );
    }

    return null;
  };

  const renderExpandedWidget = () => {
    if (effectiveConsentRequired && !hasConsent) {
      return (
        <ConsentForm
          consentTitle={effectiveConsentTitle}
          consentContent={effectiveConsentContent}
          onAccept={handleConsentAgree}
          onCancel={handleConsentCancel}
          colors={colors}
          styles={styles}
          radius={radius}
        />
      );
    }

    return (
      <div style={getExpandedWidgetStyle()}>
        <WidgetHeader
          mode={mode}
          connectionStatus={buzztrail.voice.connectionStatus}
          isCallActive={buzztrail.voice.isCallActive}
          isSpeaking={buzztrail.voice.isSpeaking}
          isTyping={buzztrail.chat.isTyping}
          hasActiveConversation={buzztrail.conversation.length > 0}
          mainLabel={effectiveTextWidgetTitle}
          onClose={() => setIsExpanded(false)}
          onReset={handleReset}
          colors={colors}
          styles={styles}
        />

        {/* Conversation Area */}
        <div
          className="buzztrail-conversation-area"
          style={{
            ...getConversationAreaStyle(),
            ...getConversationLayoutStyle(),
          }}
        >
          {renderConversationArea()}
        </div>

        {/* Controls Area */}
        <div style={getControlsAreaStyle()}>{renderControls()}</div>
      </div>
    );
  };

  return (
    <div className="buzztrail-widget-wrapper">
      <div
        style={{
          position: 'fixed',
          zIndex: 9999,
          ...positionStyles[position],
        }}
      >
        {showExpandedView ? (
          renderExpandedWidget()
        ) : (
          <FloatingButton
            isCallActive={buzztrail.voice.isCallActive}
            connectionStatus={buzztrail.voice.connectionStatus}
            isSpeaking={buzztrail.voice.isSpeaking}
            isTyping={buzztrail.chat.isTyping}
            volumeLevel={buzztrail.voice.volumeLevel}
            onClick={handleFloatingButtonClick}
            onToggleCall={handleToggleCall}
            mainLabel={effectiveTextWidgetTitle}
            ctaTitle={effectiveCtaTitle}
            ctaSubtitle={effectiveCtaSubtitle}
            colors={colors}
            styles={styles}
            mode={mode}
          />
        )}
      </div>
    </div>
  );
};

export default BuzzTrailWidget;
