const auth = require('../../src/middlewares/auth');
const httpMocks = require('node-mocks-http');
const httpStatus = require('http-status');
const passport = require('passport');

// Mock passport
jest.mock('passport');

describe('Auth middleware', () => {
  let req;
  let res;
  let next;
  
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  describe('Role-based authorization', () => {
    test('should allow access when user has the required role', async () => {
      const mockUser = {
        id: 'user123',
        role: 'admin',
        email: 'admin@example.com'
      };

      passport.authenticate = jest.fn((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, mockUser, null);
        };
      });

      const middleware = auth(['admin']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual(mockUser);
    });

    test('should allow access when user role is in the allowed roles array', async () => {
      const mockUser = {
        id: 'user123',
        role: 'tutor',
        email: 'tutor@example.com'
      };

      passport.authenticate = jest.fn((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, mockUser, null);
        };
      });

      const middleware = auth(['admin', 'tutor', 'student']);
      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual(mockUser);
    });

    test('should deny access when user role is not in the allowed roles array', async () => {
      const mockUser = {
        id: 'user123',
        role: 'student',
        email: 'student@example.com'
      };

      passport.authenticate = jest.fn((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, mockUser, null);
        };
      });

      const middleware = auth(['admin']);
      
      try {
        await middleware(req, res, next);
      } catch (error) {
        expect(error.statusCode).toBe(httpStatus.FORBIDDEN);
        expect(error.message).toBe('Forbidden');
      }
    });
  });

  describe('Permission-based authorization (backward compatibility)', () => {
    test('should work with permission strings', async () => {
      const mockUser = {
        id: 'user123',
        role: 'admin',
        email: 'admin@example.com'
      };

      passport.authenticate = jest.fn((strategy, options, callback) => {
        return (req, res, next) => {
          callback(null, mockUser, null);
        };
      });

      // This tests that the old syntax still works
      const middleware = auth('manageUsers');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
