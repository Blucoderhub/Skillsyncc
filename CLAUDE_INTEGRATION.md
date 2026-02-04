# 🤖 Claude Integration Guide

## 🚀 Claude API Setup

### 1. Get Your Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and save your API key securely

### 2. Configure Claude in the Extension
1. Click the Job Copilot extension icon
2. Go to Options/Settings
3. Select "Anthropic" as your AI Provider
4. Paste your Anthropic API key
5. Choose your preferred Claude model:
   - `claude-3-5-sonnet-20241022` (Recommended - Latest)
   - `claude-3-opus-20240229` (Most capable)
   - `claude-3-sonnet-20240229` (Balanced)
   - `claude-3-haiku-20240307` (Fastest)

### 3. Claude-Specific Features

#### Enhanced JSON Handling
- Uses Anthropic's beta JSON mode for better structured responses
- Improved prompt engineering for consistent JSON output
- Robust error handling for API rate limits

#### Optimized Prompts
- Claude-specific system prompts for better JSON generation
- Explicit instructions to avoid markdown formatting
- Clear response structure requirements

#### Performance Benefits
- Faster response times with Haiku model
- Better reasoning with Opus model
- Cost-effective with Sonnet model

### 4. Model Comparison

| Model | Speed | Intelligence | Cost | Best For |
|-------|-------|-------------|------|----------|
| Haiku | ⚡⚡⚡ | 🧠 | 💰 | Quick responses, simple tasks |
| Sonnet | ⚡⚡ | 🧠🧠 | 💰💰 | Balanced performance (Recommended) |
| Opus | ⚡ | 🧠🧠🧠 | 💰💰💰 | Complex analysis, detailed responses |

### 5. Troubleshooting

#### Common Issues:
- **API Key Error**: Verify your API key is correct and has credits
- **Rate Limiting**: Reduce request frequency or upgrade your plan
- **JSON Parsing**: Claude responses are now properly formatted for parsing
- **Timeout Errors**: Try a faster model like Haiku for quick tasks

#### Error Messages:
- `401 Unauthorized`: Invalid API key
- `429 Rate Limited`: Too many requests, wait and retry
- `500 Internal Error`: Server issue, retry after delay

### 6. Best Practices

1. **Start with Sonnet** - Best balance of quality and cost
2. **Use Haiku for simple tasks** - Like form field suggestions
3. **Use Opus for complex analysis** - Like detailed job matching
4. **Monitor usage** - Keep track of API costs in your Anthropic dashboard
5. **Cache responses** - Avoid redundant API calls for repeated queries

### 7. Cost Management

Claude pricing (as of 2024):
- **Haiku**: ~$0.25/million tokens input, ~$1.25/million tokens output
- **Sonnet**: ~$3.00/million tokens input, ~$15.00/million tokens output  
- **Opus**: ~$15.00/million tokens input, ~$75.00/million tokens output

**Tips to reduce costs:**
- Use Haiku for simple autofill tasks
- Cache job analysis results
- Limit response length in prompts
- Use batch processing when possible

### 8. Advanced Configuration

You can customize Claude behavior through:
- **Temperature**: 0.7 (default) - balance creativity and accuracy
- **Max Tokens**: 4096 (default) - adjust based on response needs
- **System Prompts**: Pre-defined instructions for consistent behavior

### 9. Migration from OpenAI

If switching from OpenAI:
1. Update your API provider setting to "Anthropic"
2. Enter your Claude API key
3. Test with a simple job analysis
4. Adjust model selection based on your needs
5. Update any custom prompts if needed

### 10. Support Resources

- [Anthropic Documentation](https://docs.anthropic.com/)
- [Claude API Reference](https://docs.anthropic.com/claude/reference/)
- [Prompt Engineering Guide](https://docs.anthropic.com/claude/prompt-engineering)

---
**Ready to supercharge your job applications with Claude?** 🚀