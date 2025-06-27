import { updateBuilder } from '@firebase/client/builders/updateBuilder';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Firebase Firestore
const mockUpdateDoc = vi.fn();
const mockDoc = vi.fn();
const mockGetFirestore = vi.fn();

vi.mock('firebase/firestore', () => ({
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  getFirestore: mockGetFirestore,
}));

// Mock toFirestoreEntry utility
const mockToFirestoreEntry = vi.fn();
vi.mock('@utils/client/toFirestoreEntry', () => ({
  toFirestoreEntry: mockToFirestoreEntry,
}));

describe('updateBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFirestore.mockReturnValue('mockFirestore');
    mockDoc.mockReturnValue('mockDocRef');
    mockToFirestoreEntry.mockReturnValue({ mockData: 'transformed' });
  });

  it('should require builder.key to be present', async () => {
    const builder = {
      name: 'Test Builder',
      description: 'Test Description',
    };

    await expect(updateBuilder(builder)).rejects.toThrow(
      'updateBuilder: builder.key is required',
    );
  });

  it('should call updateDoc with correct parameters', async () => {
    const builder = {
      key: 'test-builder',
      name: 'Test Builder',
      description: 'Test Description',
    };

    await updateBuilder(builder);

    expect(mockGetFirestore).toHaveBeenCalled();
    expect(mockDoc).toHaveBeenCalledWith(
      'mockFirestore',
      'builders', // CHARACTER_BUILDERS_COLLECTION_NAME
      'test-builder',
    );
    expect(mockToFirestoreEntry).toHaveBeenCalledWith(builder, {
      silent: false,
    });
    expect(mockUpdateDoc).toHaveBeenCalledWith('mockDocRef', {
      mockData: 'transformed',
    });
  });

  it('should handle silent flag correctly', async () => {
    const builder = {
      key: 'test-builder',
      name: 'Test Builder',
    };

    await updateBuilder(builder, true);

    expect(mockToFirestoreEntry).toHaveBeenCalledWith(builder, {
      silent: true,
    });
  });

  it('should use merge by default (silent: false)', async () => {
    const builder = {
      key: 'test-builder',
      name: 'Updated Name',
    };

    await updateBuilder(builder);

    expect(mockToFirestoreEntry).toHaveBeenCalledWith(builder, {
      silent: false,
    });
  });
});
