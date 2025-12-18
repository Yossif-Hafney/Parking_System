package database;

public class DatabaseConfig {

    private static final String DEFAULT_HOST = "localhost";
    private static final int DEFAULT_PORT = 5432;
    private static final String DEFAULT_DATABASE = "parking_db";
    private static final String DEFAULT_USER = "postgres";
    private static final String DEFAULT_PASSWORD = "postgres";

    private final String host;
    private final int port;
    private final String database;
    private final String user;
    private final String password;

    public DatabaseConfig() {
        this.host = getEnv("DB_HOST", DEFAULT_HOST);
        this.port = Integer.parseInt(getEnv("DB_PORT", String.valueOf(DEFAULT_PORT)));
        this.database = getEnv("DB_NAME", DEFAULT_DATABASE);
        this.user = getEnv("DB_USER", DEFAULT_USER);
        this.password = getEnv("DB_PASSWORD", DEFAULT_PASSWORD);
    }

    public DatabaseConfig(String host, int port, String database, String user, String password) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.user = user;
        this.password = password;
    }

    public String getConnectionUrl() {
        return String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
    }

    public String getUser() {
        return user;
    }

    public String getPassword() {
        return password;
    }

    private static String getEnv(String key, String defaultValue) {
        String value = System.getenv(key);
        return (value != null && !value.isEmpty()) ? value : defaultValue;
    }
}
