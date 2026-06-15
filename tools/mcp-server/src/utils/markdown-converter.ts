import { PlatformUsage } from './platform-usage.js';

/**
 * Converts platform usage data to a markdown format
 */
export function convertPlatformUsageToMarkdown(usage: PlatformUsage): string {
  const sections: string[] = [];

  // Title
  sections.push(`# ${usage.platform.toUpperCase()} Integration Guide\n`);

  // Installation
  sections.push('## Installation\n');
  sections.push('### Core Package');
  sections.push('```bash');
  sections.push(usage.installation.core);
  sections.push('```\n');

  if (usage.installation.packages.length > 0) {
    sections.push('### Icon Packages');
    sections.push('Available icon packages:');
    sections.push('```bash');
    sections.push(usage.installation.packages.join('\n'));
    sections.push('```\n');
  }

  // Basic Usage
  sections.push('## Basic Usage\n');
  sections.push('```' + (usage.platform === 'flutter' ? 'dart' : 'typescript'));
  sections.push(usage.basicUsage);
  sections.push('```\n');

  // Props
  if (usage.props && usage.props.length > 0) {
    sections.push('## Props\n');
    sections.push('| Prop | Type | Default | Description |');
    sections.push('|------|------|---------|-------------|');
    usage.props.forEach(prop => {
      sections.push(`| \`${prop.name}\` | \`${prop.type}\` | ${prop.default || '-'} | ${prop.description} |`);
    });
    sections.push('');
  }

  return sections.join('\n');
} 