import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import * as GitHubService from './services/github.js';
import * as GeminiService from './services/gemini.js';
import * as VercelService from './services/vercel.js';

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required!');
  console.log('💡 Create a .env file with your bot token from @BotFather');
  process.exit(1);
}

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// User session storage (in-memory for now)
interface UserSession {
  githubToken?: string;
  selectedRepo?: string;
  geminiKey?: string;
  vercelToken?: string;
  lastDeploymentId?: string;
}

const sessions = new Map<number, UserSession>();

/**
 * Get or create user session
 */
function getSession(userId: number): UserSession {
  if (!sessions.has(userId)) {
    sessions.set(userId, {});
  }
  return sessions.get(userId)!;
}

/**
 * /start command - Welcome message
 */
bot.command('start', async (ctx) => {
  const userName = ctx.from.first_name || 'Developer';

  await ctx.reply(
    `🚀 *Welcome to Vibers Bot, ${userName}!*\n\n` +
    `I can help you manage your coding projects right from Telegram.\n\n` +
    `*Available Commands:*\n` +
    `/setup - Configure your GitHub token\n` +
    `/projects - List your repositories\n` +
    `/select <repo> - Select a repository\n` +
    `/vibe <prompt> - Generate code with AI\n` +
    `/deploy - Deploy to Vercel\n` +
    `/status - Check deployment status\n` +
    `/help - Show this message\n\n` +
    `Let's start by setting up your GitHub token!\n` +
    `Use /setup to begin.`,
    { parse_mode: 'Markdown' }
  );
});

/**
 * /help command - Show help
 */
bot.command('help', async (ctx) => {
  await ctx.reply(
    `📚 *Vibers Bot Help*\n\n` +
    `*Setup Commands:*\n` +
    `/setup - Configure GitHub token\n` +
    `/setgemini <key> - Set Gemini API key\n` +
    `/setvercel <token> - Set Vercel token\n\n` +
    `*Project Commands:*\n` +
    `/projects - List repositories\n` +
    `/select <repo> - Select repository\n` +
    `/info - Show current selection\n\n` +
    `*Coding Commands:*\n` +
    `/vibe <prompt> - Generate code\n` +
    `/deploy - Deploy to Vercel\n` +
    `/status - Deployment status\n\n` +
    `*Examples:*\n` +
    `\`/vibe Create a login page\`\n` +
    `\`/select my-awesome-project\`\n` +
    `\`/deploy\``,
    { parse_mode: 'Markdown' }
  );
});

/**
 * /setup command - GitHub token setup
 */
bot.command('setup', async (ctx) => {
  await ctx.reply(
    `🔑 *GitHub Setup*\n\n` +
    `To use Vibers Bot, I need your GitHub Personal Access Token.\n\n` +
    `*How to get a token:*\n` +
    `1. Go to GitHub Settings → Developer settings → Personal access tokens\n` +
    `2. Generate new token (classic)\n` +
    `3. Select scopes: \`repo\`, \`workflow\`\n` +
    `4. Copy the token\n\n` +
    `*Send me your token:*\n` +
    `Just paste it in the next message (it will be deleted for security)`,
    { parse_mode: 'Markdown' }
  );

  // Set a flag to expect token in next message
  const session = getSession(ctx.from.id);
  (session as any).waitingForToken = true;
});

/**
 * /setgemini command - Set Gemini API key
 */
bot.command('setgemini', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    await ctx.reply('❌ Usage: /setgemini <your_api_key>');
    return;
  }

  const apiKey = args[0];
  const session = getSession(ctx.from.id);
  session.geminiKey = apiKey;

  // Delete the message for security
  try {
    await ctx.deleteMessage();
  } catch (e) {
    // Ignore if can't delete
  }

  await ctx.reply('✅ Gemini API key saved!');
});

/**
 * /setvercel command - Set Vercel token
 */
bot.command('setvercel', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    await ctx.reply(
      '❌ Usage: /setvercel <your_vercel_token>\n\n' +
      'Get your token from: https://vercel.com/account/tokens'
    );
    return;
  }

  const vercelToken = args[0];
  const session = getSession(ctx.from.id);
  session.vercelToken = vercelToken;

  // Delete the message for security
  try {
    await ctx.deleteMessage();
  } catch (e) {
    // Ignore if can't delete
  }

  await ctx.reply('✅ Vercel token saved! You can now use /deploy');
});

/**
 * /projects command - List GitHub repositories
 */
bot.command('projects', async (ctx) => {
  const session = getSession(ctx.from.id);

  if (!session.githubToken) {
    await ctx.reply('❌ Please setup your GitHub token first with /setup');
    return;
  }

  await ctx.reply('🔄 Fetching your repositories...');

  try {
    const repos = await GitHubService.listRepositories(session.githubToken, 10);

    if (repos.length === 0) {
      await ctx.reply('📦 No repositories found. Create one on GitHub first!');
      return;
    }

    let repoList = '📦 *Your Repositories:*\n\n';
    repos.forEach((repo, index) => {
      const privacy = repo.private ? '🔒' : '🌐';
      repoList += `${index + 1}. ${privacy} *${repo.name}*\n`;
      if (repo.description) {
        repoList += `   _${repo.description}_\n`;
      }
      repoList += `   \`/select ${repo.name}\`\n\n`;
    });

    await ctx.reply(repoList, { parse_mode: 'Markdown' });
  } catch (error: any) {
    await ctx.reply(`❌ Error fetching repositories: ${error.message}`);
  }
});

/**
 * /select command - Select a repository
 */
bot.command('select', async (ctx) => {
  const session = getSession(ctx.from.id);

  if (!session.githubToken) {
    await ctx.reply('❌ Please setup your GitHub token first with /setup');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    await ctx.reply('❌ Usage: /select <repository-name>');
    return;
  }

  const repoName = args.join(' ');
  session.selectedRepo = repoName;

  await ctx.reply(`✅ Selected repository: *${repoName}*`, { parse_mode: 'Markdown' });
});

/**
 * /info command - Show current session info
 */
bot.command('info', async (ctx) => {
  const session = getSession(ctx.from.id);

  const hasGitHub = session.githubToken ? '✅' : '❌';
  const hasGemini = session.geminiKey ? '✅' : '❌';
  const hasVercel = session.vercelToken ? '✅' : '❌';
  const selectedRepo = session.selectedRepo || 'None';
  const lastDeploy = session.lastDeploymentId ? 'Yes' : 'No';

  await ctx.reply(
    `ℹ️ *Session Info*\n\n` +
    `${hasGitHub} GitHub Token\n` +
    `${hasGemini} Gemini API Key\n` +
    `${hasVercel} Vercel Token\n` +
    `📦 Repository: \`${selectedRepo}\`\n` +
    `🚀 Last Deployment: ${lastDeploy}`,
    { parse_mode: 'Markdown' }
  );
});

/**
 * /vibe command - Generate code with AI
 */
bot.command('vibe', async (ctx) => {
  const session = getSession(ctx.from.id);

  if (!session.githubToken || !session.selectedRepo) {
    await ctx.reply('❌ Please setup GitHub token and select a repository first');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);

  if (args.length === 0) {
    await ctx.reply('❌ Usage: /vibe <your prompt>\n\nExample: /vibe Create a login page with email and password');
    return;
  }

  const prompt = args.join(' ');

  await ctx.reply(`🤖 Generating code for: *${prompt}*\n\n⏳ This may take a moment...`, {
    parse_mode: 'Markdown'
  });

  try {
    // Step 1: Generate code with AI
    let vibeResponse: GeminiService.VibeResponse;

    if (session.geminiKey) {
      // Use real Gemini API
      await ctx.reply('🧠 Using Gemini AI...');
      vibeResponse = await GeminiService.generateCode(prompt, session.geminiKey);
    } else {
      // Use simulation mode
      await ctx.reply('💡 No Gemini API key set. Using simulation mode...\n(Set key with /setgemini to use real AI)');
      vibeResponse = GeminiService.simulateCodeGeneration(prompt);
    }

    // Step 2: Get user info and prepare files
    const user = await GitHubService.getCurrentUser(session.githubToken);

    if (!user) {
      throw new Error('Failed to get GitHub user info. Please check your token.');
    }

    await ctx.reply(`📝 Generated ${vibeResponse.files.length} file(s). Pushing to GitHub...`);

    // Step 3: Push to GitHub
    const pushResult = await GitHubService.pushFilesToRepo(
      session.githubToken,
      user.login,
      session.selectedRepo,
      vibeResponse.files.map(f => ({ path: f.path, content: f.content })),
      vibeResponse.suggestedCommitMessage
    );

    if (!pushResult.success) {
      throw new Error(pushResult.error || 'Failed to push to GitHub');
    }

    // Step 4: Send success message
    let successMessage = `✨ *Code Generated & Pushed!*\n\n`;
    successMessage += `${vibeResponse.message}\n\n`;
    successMessage += `📦 *Files created:*\n`;
    vibeResponse.files.forEach(f => {
      const icon = f.type === 'create' ? '➕' : f.type === 'update' ? '✏️' : '🗑️';
      successMessage += `${icon} \`${f.path}\`\n`;
    });
    successMessage += `\n🔗 [View on GitHub](${pushResult.url})\n`;
    successMessage += `\n💡 *Next steps:*\n`;
    vibeResponse.nextSteps.forEach((step, i) => {
      successMessage += `${i + 1}. ${step}\n`;
    });

    await ctx.reply(successMessage, { parse_mode: 'Markdown' });

  } catch (error: any) {
    console.error('Vibe command error:', error);
    await ctx.reply(`❌ Error: ${error.message}\n\nPlease check your tokens and try again.`);
  }
});

/**
 * /deploy command - Deploy to Vercel
 */
bot.command('deploy', async (ctx) => {
  const session = getSession(ctx.from.id);

  if (!session.selectedRepo) {
    await ctx.reply('❌ Please select a repository first with /select');
    return;
  }

  if (!session.vercelToken) {
    await ctx.reply('❌ Please set your Vercel token first with /setvercel <token>\n\nGet your token from: https://vercel.com/account/tokens');
    return;
  }

  if (!session.githubToken) {
    await ctx.reply('❌ Please setup your GitHub token first with /setup');
    return;
  }

  await ctx.reply(`🚀 Deploying *${session.selectedRepo}* to Vercel...\n\n⏳ This may take a moment...`, {
    parse_mode: 'Markdown'
  });

  try {
    // Get GitHub user info for owner
    const user = await GitHubService.getCurrentUser(session.githubToken);
    if (!user) {
      throw new Error('Failed to get GitHub user info');
    }

    // Deploy to Vercel
    const deployment = await VercelService.deployToVercel(
      session.vercelToken,
      session.selectedRepo,
      user.login
    );

    // Save deployment ID for status tracking
    session.lastDeploymentId = deployment.id;

    let statusEmoji = '⏳';
    let statusText = deployment.readyState;

    if (deployment.readyState === 'READY') {
      statusEmoji = '✅';
    } else if (deployment.readyState === 'ERROR') {
      statusEmoji = '❌';
    } else if (deployment.readyState === 'BUILDING') {
      statusEmoji = '🔨';
    }

    await ctx.reply(
      `✨ *Deployment Started!*\n\n` +
      `${statusEmoji} Status: ${statusText}\n` +
      `🔗 URL: ${deployment.url}\n\n` +
      `Use /status to check deployment progress`,
      { parse_mode: 'Markdown' }
    );

  } catch (error: any) {
    console.error('Deploy command error:', error);
    await ctx.reply(`❌ Deployment failed: ${error.message}\n\nPlease check your tokens and repository settings.`);
  }
});

/**
 * /status command - Check deployment status
 */
bot.command('status', async (ctx) => {
  const session = getSession(ctx.from.id);

  if (!session.vercelToken) {
    await ctx.reply('❌ Please set your Vercel token first with /setvercel <token>');
    return;
  }

  if (!session.lastDeploymentId) {
    await ctx.reply('❌ No recent deployment found. Use /deploy first!');
    return;
  }

  await ctx.reply('🔍 Checking deployment status...');

  try {
    const deployment = await VercelService.getDeploymentStatus(
      session.vercelToken,
      session.lastDeploymentId
    );

    let statusEmoji = '⏳';
    let statusMessage = '';

    switch (deployment.readyState) {
      case 'READY':
        statusEmoji = '✅';
        statusMessage = 'Your deployment is live and ready!';
        break;
      case 'BUILDING':
        statusEmoji = '🔨';
        statusMessage = 'Your deployment is currently building...';
        break;
      case 'QUEUED':
        statusEmoji = '⏳';
        statusMessage = 'Your deployment is queued and will start soon.';
        break;
      case 'ERROR':
        statusEmoji = '❌';
        statusMessage = 'Your deployment encountered an error.';
        break;
      case 'CANCELED':
        statusEmoji = '🚫';
        statusMessage = 'Your deployment was canceled.';
        break;
    }

    await ctx.reply(
      `📊 *Deployment Status*\n\n` +
      `${statusEmoji} Status: ${deployment.readyState}\n` +
      `${statusMessage}\n\n` +
      `🔗 URL: ${deployment.url}\n` +
      `🕐 Created: ${new Date(deployment.created).toLocaleString()}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error: any) {
    console.error('Status command error:', error);
    await ctx.reply(`❌ Failed to check status: ${error.message}`);
  }
});

/**
 * Handle regular messages (for token input)
 */
bot.on(message('text'), async (ctx) => {
  const session = getSession(ctx.from.id);

  // Check if waiting for GitHub token
  if ((session as any).waitingForToken) {
    const token = ctx.message.text;

    // Validate token format (ghp_...)
    if (token.startsWith('ghp_') || token.startsWith('github_pat_')) {
      session.githubToken = token;
      delete (session as any).waitingForToken;

      // Delete the message for security
      try {
        await ctx.deleteMessage();
      } catch (e) {
        // Ignore if can't delete
      }

      await ctx.reply('✅ GitHub token saved securely!\n\nNow try /projects to see your repositories.');
    } else {
      await ctx.reply('❌ Invalid token format. Please send a valid GitHub token (starts with ghp_)');
    }
    return;
  }

  // Default response for other messages
  await ctx.reply('💡 Type /help to see available commands');
});

/**
 * Error handler
 */
bot.catch((err, ctx) => {
  console.error(`❌ Error for ${ctx.updateType}`, err);
  ctx.reply('❌ An error occurred. Please try again.');
});

/**
 * Start the bot
 */
console.log('🤖 Starting Vibers Telegram Bot...');
console.log('');

bot.launch().then(() => {
  console.log('✅ Bot is running!');
  console.log('💡 Send /start to your bot in Telegram');
  console.log('');
  console.log('Press Ctrl+C to stop');
});

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('\n👋 Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n👋 Stopping bot...');
  bot.stop('SIGTERM');
});
