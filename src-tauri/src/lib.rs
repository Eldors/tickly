// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, deleted INTEGER DEFAULT 0 CHECK (deleted IN (0, 1)));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "test_migration",
            sql: "CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, taskId INTEGER, createdAt TEXT, duration INTEGER DEFAULT null, deleted INTEGER DEFAULT 0 CHECK (deleted IN (0, 1)));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "add_color_column_to_task",
            sql: "
                ALTER TABLE tasks
                ADD color INTEGER DEFAULT 0 CHECK (color IN (0, 360));

                -- Update existing tasks
                UPDATE tasks
                SET color = 0
                WHERE color IS NULL;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "change_color_column_type",
            sql: "
                ALTER TABLE tasks
                DROP COLUMN color
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "add_color_column_to_task",
            sql: "
                ALTER TABLE tasks
                ADD color TEXT;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_task_order_table",
            sql: "
                CREATE TABLE IF NOT EXISTS task_order (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_id INTEGER NOT NULL,
                    position INTEGER NOT NULL,
                    FOREIGN KEY(task_id) REFERENCES tasks(id)
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "fill_task_order_table",
            sql: "
                INSERT INTO task_order (task_id, position)
                SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1
                FROM tasks
                WHERE deleted = 0;
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:app.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
