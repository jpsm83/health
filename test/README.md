# Testing Setup

This directory contains comprehensive tests for the health application using [Vitest](https://vitest.dev/).

## Test Structure

```
test/
├── setup.ts                    # Global test setup and mocks
├── utils/
│   └── testHelpers.ts          # Test utilities and mock data
└── api/
    └── v1/
        └── articles/
            └── route.test.ts   # POST /articles route tests
```

## Running Tests

### All Tests
```bash
npm run test
```

### Run Tests Once
```bash
npm run test:run
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run with UI
```bash
npm run test:ui
```

## Test Coverage

The POST /articles route tests cover:

### ✅ Authentication
- Unauthenticated requests (401)
- Authenticated requests (success)

### ✅ Input Validation
- Missing required fields
- Invalid category values
- Malformed JSON data
- Empty arrays and objects

### ✅ Content Validation
- Article content structure
- SEO metadata validation
- Language-specific validation
- URL pattern validation

### ✅ File Validation
- Missing image files
- File count mismatch
- Empty files
- Invalid file types

### ✅ Database Operations
- Duplicate slug detection
- Database connection
- Article creation
- Error handling

### ✅ Cloudinary Integration
- Image upload success
- Upload failure handling
- Invalid response handling

### ✅ Error Handling
- Database errors
- Cloudinary errors
- Validation errors
- Network errors

### ✅ Edge Cases
- Malformed JSON
- Very long content
- Multiple languages
- Special characters

## Mock Strategy

The tests use comprehensive mocking to isolate the route logic:

- **NextAuth**: Mocked authentication
- **Database**: Mocked MongoDB operations
- **Cloudinary**: Mocked file upload service
- **Validation**: Mocked utility functions
- **Error Handling**: Mocked error responses

## Test Data

Mock data is centralized in `testHelpers.ts`:
- Valid article data
- Invalid data scenarios
- File mock utilities
- Error message constants

## Configuration

Tests are configured in `vitest.config.ts`:
- Node.js environment
- Path aliases (@/ → ./)
- Global test setup
- TypeScript support
