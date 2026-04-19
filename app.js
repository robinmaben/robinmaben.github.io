(function () {
  'use strict';

  // === Virtual Filesystem ===
  const FILES = {
    'summary.txt': [
      'Robin Maben',
      'Software Engineer, Azure Core @ Microsoft',
      'Dublin, Ireland',
      '',
      'Continuous learning, customer-focussed problem-solving.',
      '10+ years experience across fintech, ed-tech, travel, recruitment, developer tools.',
      'Python, Django, React, SQL, Big Data & Distributed Systems Architecture.',
    ].join('\n'),

    'contact.txt': [
      'Email:    robinmaben@outlook.com',
      'LinkedIn: linkedin.com/in/robinmaben',
      'GitHub:   github.com/robinmaben',
      'Web:      robinmaben.pro',
    ].join('\n'),

    'recent-experience.txt': [
      'MICROSOFT — Software Engineer II',
      'Sep 2024 – Present | Dublin',
      'Azure Growth Experiences (Azure Core)',
      '- Empower start-up founders and AI app developers to manage and optimize their Azure resources',
      'Customer Success Engineering',
      '- Drive adoption of AI-powered tooling to eliminate toil from developers\' workflows',
      '- Enforce best-in-class standards across Identity and Secrets infrastructure',
      '',
      'CLOUDSMITH — Staff Engineer',
      'Jun 2024 – Aug 2024 | Dublin',
      '- Migrated legacy Django templates web app into a modern Next.js React web app',
      '- Collaborated across teams to enhance security middleware and reduce performance bottlenecks',
      '',
      'OUTMIN — Senior Software Engineer',
      'Nov 2023 – Jun 2024 | Dublin',
      'AI-assisted solution that monitors and manages customers\' financial operations.',
    ].join('\n'),

    'past-experience.txt': [
      'UDEMY — Engineering Manager',
      'Sep 2020 – Feb 2023 | Dublin',
      '- Managed ten engineers, only one attrition (to higher education)',
      '- Led Enterprise Learning Insights team — analytics dashboards aggregating billions of data points using Apache Spark and Airflow',
      '- Formed & led Product-Led Growth team — delivered \'learning streaks\' and behavior-altering experiments',
      '',
      'UDEMY — Senior Software Engineer',
      'Dec 2017 – Sep 2020 | Dublin',
      '- Overhauled web-based learner course-taking experience (Python, Django, React, MobX) — used by millions, still in production',
      '- Managed translation workflows, increased reach via machine translation',
      '- Built crowd-sourcing product for caption editing',
      '',
      'AGODA — Senior Software Engineer',
      'Jul 2017 – Dec 2017 | Bangkok',
      '- Built experiments into map explorer ensuring zero revenue loss',
      '',
      'RECRUITERBOX — Engineering Lead',
      'Jul 2015 – Jul 2017 | Bengaluru',
      '- Built web-scale recruitment software (Python, Django, MySQL, React + Redux)',
      '- Maintained weekly feature release cadence as a bootstrapped company',
      '- Led & mentored 5 full-stack engineers, 1 QA, 1 intern',
      '',
      'ODESSA TECHNOLOGIES — Software Engineer',
      'Apr 2010 – Jul 2015',
      '- C# .NET, ASP.NET MVC, Workflow Foundation, Entity Framework, SQL Server',
      '- Developed a low-code platform for banking products',
      '- Tech lead for a team of 5 junior engineers',
    ].join('\n'),

    'education.txt': [
      'Karunya University',
      'B.Tech, Computer Science and Engineering (2006 – 2010)',
      '',
      'N. Wadia College of Arts & Science',
      'High School, Electronics (2004 – 2006)',
    ].join('\n'),

    'skills.txt': [
      'Languages:    Python, JavaScript/TypeScript, C#, SQL',
      'Frameworks:   Django, React, Next.js, ASP.NET MVC',
      'Data:         Apache Spark, Apache Airflow, Big Data ETL',
      'Cloud:        Azure, Distributed Systems',
      'Tools:        KQL, Microsoft Power Platform',
    ].join('\n'),

    'languages.txt': [
      'English    Full Professional',
      'Marathi    Native',
      'Hindi      Professional Working',
      'French     Elementary',
    ].join('\n'),
  };

  const COMMANDS = ['whoami', 'ls', 'cat', 'help', 'theme', 'clear', 'history', 'pwd'];
  const THEMES = ['dark', 'light', 'solarized', 'monokai'];

  // === State ===
  const cmdHistory = [];
  let historyIndex = -1;
  let autoPlaying = false;

  // === DOM ===
  const output = document.getElementById('output');
  const cmdInput = document.getElementById('cmd-input');
  const themeIndicator = document.getElementById('theme-indicator');
  const helpHint = document.getElementById('help-hint');

  // === Output helpers ===
  function appendToOutput(html) {
    const div = document.createElement('div');
    div.className = 'output-block';
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function appendCommandLine(cmd) {
    appendToOutput(
      '<span class="prompt-text">robin@web:~$ </span><span class="cmd-text">' +
        escapeHtml(cmd) +
        '</span>'
    );
  }

  function escapeHtml(str) {
    const el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  // === Command handlers ===
  function runCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    cmdHistory.push(trimmed);
    historyIndex = cmdHistory.length;

    appendCommandLine(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'whoami':
        appendToOutput('Robin Maben — Software Engineer, Azure Core @ Microsoft');
        break;

      case 'ls':
        const fileList = Object.keys(FILES)
          .map(f => '<span class="accent-text">' + escapeHtml(f) + '</span>')
          .join('  ');
        appendToOutput(fileList);
        break;

      case 'cat':
        if (args.length === 0) {
          appendToOutput('<span class="muted-text">usage: cat &lt;filename&gt;</span>');
        } else {
          const fileName = args[0];
          if (FILES[fileName]) {
            appendToOutput(escapeHtml(FILES[fileName]));
          } else {
            appendToOutput(
              'cat: ' + escapeHtml(fileName) + ': No such file or directory'
            );
          }
        }
        break;

      case 'help':
        appendToOutput(
          [
            '<span class="cmd-text">Available commands:</span>',
            '',
            '  <span class="accent-text">whoami</span>          Who am I?',
            '  <span class="accent-text">ls</span>              List files',
            '  <span class="accent-text">cat &lt;file&gt;</span>     Show file contents',
            '  <span class="accent-text">pwd</span>             Print working directory',
            '  <span class="accent-text">history</span>         Show command history',
            '  <span class="accent-text">theme [name]</span>    Switch theme (dark, light, solarized, monokai)',
            '  <span class="accent-text">clear</span>           Clear terminal',
            '  <span class="accent-text">help</span>            Show this message',
            '',
            '<span class="muted-text">Tab to autocomplete. Up/Down for history.</span>',
          ].join('\n')
        );
        break;

      case 'theme':
        if (args.length === 0) {
          const current = document.documentElement.getAttribute('data-theme');
          appendToOutput(
            'Current: <span class="cmd-text">' + current + '</span>\n' +
            'Available: ' + THEMES.map(t =>
              t === current
                ? '<span class="cmd-text">' + t + '</span>'
                : '<span class="accent-text">' + t + '</span>'
            ).join(', ')
          );
        } else {
          const name = args[0].toLowerCase();
          if (THEMES.includes(name)) {
            document.documentElement.setAttribute('data-theme', name);
            themeIndicator.textContent = name;
            localStorage.setItem('terminal-cv-theme', name);
            appendToOutput('Theme set to <span class="cmd-text">' + name + '</span>');
          } else {
            appendToOutput(
              'Unknown theme: ' + escapeHtml(name) + '\n' +
              'Available: ' + THEMES.join(', ')
            );
          }
        }
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      case 'history':
        if (cmdHistory.length === 0) {
          appendToOutput('<span class="muted-text">No commands in history.</span>');
        } else {
          const hist = cmdHistory
            .map((c, i) => '  ' + String(i + 1).padStart(3) + '  ' + escapeHtml(c))
            .join('\n');
          appendToOutput(hist);
        }
        break;

      case 'pwd':
        appendToOutput('/home/robin');
        break;

      default:
        appendToOutput(
          'command not found: ' + escapeHtml(cmd) + '. Type \'help\' for available commands.'
        );
    }
  }

  // === Input handling ===
  cmdInput.addEventListener('keydown', function (e) {
    if (autoPlaying) {
      skipAutoPlay();
      e.preventDefault();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const val = cmdInput.value;
      cmdInput.value = '';
      runCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        cmdInput.value = cmdHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        historyIndex++;
        cmdInput.value = cmdHistory[historyIndex];
      } else {
        historyIndex = cmdHistory.length;
        cmdInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  });

  // === Tab completion ===
  function handleTabCompletion() {
    const val = cmdInput.value;
    const parts = val.split(/\s+/);

    if (parts.length <= 1) {
      // Complete command
      const partial = parts[0].toLowerCase();
      const matches = COMMANDS.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        cmdInput.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        appendCommandLine(val);
        appendToOutput(matches.join('  '));
      }
    } else {
      // Complete filename
      const partial = parts[parts.length - 1];
      const fileNames = Object.keys(FILES);
      const matches = fileNames.filter(f => f.startsWith(partial));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        cmdInput.value = parts.join(' ');
      } else if (matches.length > 1) {
        appendCommandLine(val);
        appendToOutput(
          matches.map(f => '<span class="accent-text">' + f + '</span>').join('  ')
        );
      }
    }
  }

  // === Focus management ===
  document.addEventListener('click', function (e) {
    if (autoPlaying) {
      skipAutoPlay();
      return;
    }
    if (!e.target.closest('a')) {
      cmdInput.focus();
    }
  });

  helpHint.addEventListener('click', function (e) {
    e.stopPropagation();
    if (autoPlaying) skipAutoPlay();
    runCommand('help');
    cmdInput.focus();
  });

  // === Theme persistence ===
  function loadTheme() {
    const saved = localStorage.getItem('terminal-cv-theme');
    if (saved && THEMES.includes(saved)) {
      document.documentElement.setAttribute('data-theme', saved);
      themeIndicator.textContent = saved;
    }
  }

  // === Auto-play ===
  let autoPlayResolve = null;

  function skipAutoPlay() {
    autoPlaying = false;
    if (autoPlayResolve) {
      autoPlayResolve('skip');
      autoPlayResolve = null;
    }
  }

  function sleep(ms) {
    return new Promise(resolve => {
      if (!autoPlaying) return resolve('skip');
      autoPlayResolve = resolve;
      setTimeout(() => {
        autoPlayResolve = null;
        resolve('done');
      }, ms);
    });
  }

  async function typeCommand(cmd) {
    if (!autoPlaying) {
      runCommand(cmd);
      return;
    }

    for (let i = 0; i < cmd.length; i++) {
      if (!autoPlaying) break;
      cmdInput.value = cmd.slice(0, i + 1);
      const delay = 40 + Math.random() * 30;
      const result = await sleep(delay);
      if (result === 'skip') break;
    }

    cmdInput.value = '';
    runCommand(cmd);
  }

  async function autoPlay() {
    autoPlaying = true;
    cmdInput.disabled = true;

    await typeCommand('whoami');
    if (autoPlaying) await sleep(500);

    await typeCommand('ls');
    if (autoPlaying) await sleep(500);

    await typeCommand('cat summary.txt');
    if (autoPlaying) await sleep(300);

    if (autoPlaying) {
      appendToOutput(
        '<span class="muted-text">Type \'help\' for available commands.</span>'
      );
    } else {
      // Skipped — still show the hint
      appendToOutput(
        '<span class="muted-text">Type \'help\' for available commands.</span>'
      );
    }

    autoPlaying = false;
    cmdInput.disabled = false;
    cmdInput.focus();
  }

  // === Init ===
  loadTheme();
  autoPlay();
})();
