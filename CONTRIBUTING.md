# Contributing to Bagdja Marketplace

Terima kasih atas ketertarikan Anda untuk berkontribusi! 🎉

## 🚀 Getting Started

1. Fork repository ini
2. Clone fork Anda:
   ```bash
   git clone https://github.com/your-username/bagdja-marketplace.git
   ```
3. Install dependencies:
   ```bash
   cd bagdja-marketplace
   # Install di setiap repository
   cd bagdja-api-services && npm install
   cd ../bagdja-store-frontend && npm install
   cd ../bagdja-console-frontend && npm install
   ```
4. Buat branch baru:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📝 Development Guidelines

### Code Style

- Gunakan TypeScript untuk type safety
- Follow existing code patterns
- Use meaningful variable names
- Write comments untuk logic yang kompleks
- Format code dengan Prettier (auto on save)

### Component Guidelines

- Functional components with hooks
- Props types harus didefinisikan
- Keep components focused (single responsibility)
- Reusable components di folder `components/`
- Page-specific components di folder `pages/`

### API Guidelines

- RESTful conventions
- Consistent response format
- Error handling di semua endpoints
- JWT validation untuk protected routes
- Owner isolation untuk CRUD operations

### Commit Messages

Format:
```
<type>(<scope>): <subject>

<body>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Example:
```
feat(products): add image upload functionality

- Implement image upload to Supabase Storage
- Add image preview in product form
- Update product model with images array
```

## 🧪 Testing

Sebelum submit PR, pastikan:

1. **Local testing**:
   ```bash
   npm run dev  # Test di local
   npm run build  # Pastikan build berhasil
   ```

2. **Manual testing**:
   - Test semua affected features
   - Test di different browsers
   - Test responsive design

3. **No errors**:
   - No console errors
   - No TypeScript errors
   - No linter warnings

## 📤 Submitting Changes

1. Commit changes Anda:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

2. Push ke fork Anda:
   ```bash
   git push origin feature/amazing-feature
   ```

3. Open Pull Request di GitHub

4. Describe your changes:
   - What was changed?
   - Why was it changed?
   - How to test it?
   - Screenshots (jika UI changes)

## 🐛 Bug Reports

Jika menemukan bug, buat issue dengan informasi:

1. **Description**: Jelaskan bug-nya
2. **Steps to reproduce**: Langkah-langkah untuk reproduce bug
3. **Expected behavior**: Apa yang seharusnya terjadi
4. **Actual behavior**: Apa yang sebenarnya terjadi
5. **Environment**: OS, Browser, Node version, etc.
6. **Screenshots**: Jika applicable

Template:
```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected**
Should do X

**Actual**
Does Y instead

**Environment**
- OS: macOS 14.0
- Browser: Chrome 120
- Node: 18.17.0
```

## 💡 Feature Requests

Untuk suggest new feature:

1. **Check existing issues** - Mungkin sudah ada yang suggest
2. **Create issue** dengan label "feature request"
3. Explain:
   - What feature?
   - Why is it needed?
   - How should it work?
   - Use cases

## 🔍 Code Review Process

Setelah submit PR:

1. Maintainers akan review code
2. Mungkin ada feedback/changes requested
3. Address feedback dan push updates
4. Once approved, akan di-merge

## 📚 Areas to Contribute

### Frontend
- [ ] Improve UI/UX design
- [ ] Add loading states
- [ ] Better error handling
- [ ] Accessibility improvements
- [ ] Performance optimization

### Backend
- [ ] Add new endpoints
- [ ] Improve error handling
- [ ] Add rate limiting
- [ ] Better logging
- [ ] Add caching

### Features
- [ ] Shopping cart
- [ ] Payment integration
- [ ] Order management
- [ ] Product reviews
- [ ] Image upload
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics

### Documentation
- [ ] Improve existing docs
- [ ] Add code examples
- [ ] API documentation
- [ ] Video tutorials
- [ ] Translation to English

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing

## 🤝 Community

- Be respectful and inclusive
- Help others when possible
- Share knowledge
- Follow code of conduct

## 📞 Questions?

- Open an issue dengan label "question"
- Check existing documentation
- Review closed issues

---

Thank you for contributing to Bagdja Marketplace! 🚀

