export class Version {
  major: number;
  minor: number;
  patch: number;

  constructor(versionString: string) {
    const parts = versionString.split(".").map((p) => parseInt(p) || 0);
    this.major = parts[0];
    this.minor = parts[1];
    this.patch = parts[2];
  }
  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
  isNewerThan(v: Version): boolean {
    return (
      this.major > v.major ||
      (this.major === v.major && this.minor > v.minor) ||
      (this.major === v.major && this.minor === v.minor && this.patch > v.patch)
    );
  }
  isSameAs(v: Version): boolean {
    return this.major === v.major && this.minor === v.minor && this.patch === v.patch;
  }
  isOlderThan(v: Version): boolean {
    return v.isNewerThan(this);
  }
}
