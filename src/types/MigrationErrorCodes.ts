enum MigrationErrorCodes {
  NoMigrations = 0,
  NoZeroMigration = 1,
  IncorrectMigrationsOrder = 2,
  ValidationFailed = 3,
  MigrationNotFound = 4,
  MigrationFailed = 5,
}

export default MigrationErrorCodes;
