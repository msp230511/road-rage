# Contributing to Road Rage

Thank you for your interest in contributing to Road Rage! This document outlines the development workflow for the project.

## Pull Request Workflow

All changes to the `main` branch must go through a Pull Request (PR) process. Direct commits to `main` are not allowed.

### Making Changes

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/` - New features (e.g., `feature/vehicle-modifications`)
   - `fix/` - Bug fixes (e.g., `fix/collision-detection`)
   - `refactor/` - Code refactoring (e.g., `refactor/game-loop`)
   - `docs/` - Documentation updates (e.g., `docs/update-readme`)

2. **Make your changes** on the feature branch:
   - Write clean, readable code
   - Follow the existing code style
   - Test your changes thoroughly

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Clear description of what changed"
   ```

   Commit message guidelines:
   - Use present tense ("Add feature" not "Added feature")
   - Be specific and descriptive
   - Reference issues if applicable (e.g., "Fix #123: Collision bug")

4. **Push your branch** to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**:
   - Go to GitHub and create a PR from your feature branch to `main`
   - Fill in the PR template with:
     - Clear description of changes
     - Testing performed
     - Any relevant screenshots or videos
     - Related issues

6. **Code Review**:
   - Wait for review and approval
   - Address any feedback by pushing additional commits to your branch
   - Once approved, the PR can be merged

### PR Requirements

Before a PR can be merged, it must:
- [ ] Have a clear, descriptive title
- [ ] Include a description of what changed and why
- [ ] Be tested and working
- [ ] Have at least one approval (if team size allows)
- [ ] Have no merge conflicts with `main`

### After Merging

Once your PR is merged:
1. Delete your feature branch locally:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   ```

2. The remote branch will typically be auto-deleted after merge

## Local Development

### Running the Game

Simply open [index.html](index.html) in any modern web browser. No build step required.

### Testing Utilities

Located in the [scripts/](scripts/) folder:
- `give_coins.html` - Add coins for testing (modify `COINS_TO_ADD` constant)
- `reset_coins.html` - Reset coins to 0
- `lock_vehicles.html` - Lock all vehicles except motorcycle

### Code Style

- Use 2-space indentation
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small
- Update [CLAUDE.md](CLAUDE.md) when making architectural changes

## Getting Help

If you have questions or need help:
- Check [CLAUDE.md](CLAUDE.md) for architecture documentation
- Check [README_TODO.md](README_TODO.md) for planned features
- Open an issue for discussion
- Ask in the PR if you're stuck during code review

## Development Setup

### First Time Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd "Motorcycle Game"

# Configure git username and email (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Staying Up to Date

Before starting new work, always update your local `main`:

```bash
git checkout main
git pull origin main
```

## Common Git Commands

```bash
# Check status of files
git status

# See what you've changed
git diff

# View commit history
git log --oneline

# Switch branches
git checkout branch-name

# See all branches
git branch -a

# Undo unstaged changes to a file
git checkout -- filename

# View remote URL
git remote -v
```

## Questions?

If you're unsure about any part of this workflow, please ask before proceeding. It's better to clarify than to create issues later!
