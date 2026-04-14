# Contributing to Rex-25 MCP

Thanks for your interest. Rex-25 MCP is the public, MIT-licensed surface of a larger sovereign AI stack. We welcome bug reports, feature requests, and pull requests from anyone.

## Ground rules

1. Be civil. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).
2. Open an issue before large PRs. Saves everyone time.
3. Keep PRs focused. One concern per PR.
4. No telemetry, no analytics, no ads. PRs that add any of these will be closed.
5. Public repo only contains the public surface. Do not file PRs asking for the private quantizer or kernel internals to be merged here.

## Getting set up

```bash
git clone https://github.com/ElromEvedElElyon/Rex-25-MCP.git
cd Rex-25-MCP
npm install
npm run build
npm test
```

Node 18 or later is required.

## Branch naming

- `fix/<short-slug>` for bug fixes
- `feat/<short-slug>` for features
- `docs/<short-slug>` for documentation
- `chore/<short-slug>` for tooling

## Commit style

Conventional commits, lower-case subject, no trailing period.

```
feat(tool): add rex25_node_status timeout flag
fix(chat): handle empty vendor response
docs(readme): clarify cursor setup
```

## Pull request checklist

- [ ] Tests pass locally (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tool schemas validated (`npm run schema:check`)
- [ ] CHANGELOG.md updated under "Unreleased"
- [ ] No new runtime dependencies without justification in the PR description
- [ ] No telemetry, no network calls outside declared tool scope

## Issue templates

When filing an issue, please include:

- OS and Node version (`node -v`)
- Rex-25 version (`rex25-mcp --version`)
- MCP host (Claude Desktop, Cursor, etc.) and version
- Minimal reproduction
- Expected vs actual behavior

## Security issues

Do **not** open public issues for security problems. See [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree your contributions will be licensed under the MIT License.
