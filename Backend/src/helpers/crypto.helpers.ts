import bcrypt from 'bcrypt';

class EncryptionManager {
  private saltRounds: number;

  constructor(saltRounds: number) {
    this.saltRounds = saltRounds;
  }

  public async encrypt(data: string): Promise<string | false> {
    try {
      const salt: string = await bcrypt.genSalt(this.saltRounds);
      const hash: string = await bcrypt.hash(data, salt);
      return hash;
    } catch (error) {
      return false;
    }
  }

  public async compare(data: string, hash: string): Promise<boolean> {
    const value: boolean = await bcrypt.compare(data, hash);
    return value;
  }
}

const saltRounds: number = 10;
const encryptionManager = new EncryptionManager(saltRounds);

export default encryptionManager;
