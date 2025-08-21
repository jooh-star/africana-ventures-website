import os
import sqlite3


def column_exists(connection: sqlite3.Connection, table: str, column: str) -> bool:
    cursor = connection.execute(f"PRAGMA table_info({table})")
    cols = {row[1] for row in cursor.fetchall()}
    return column in cols


def migrate_db(db_path: str) -> None:
    if not os.path.exists(db_path):
        print(f"[skip] {db_path} not found")
        return
    print(f"[migrate] {db_path}")
    conn = sqlite3.connect(db_path)
    try:
        # Helper: table exists
        def table_exists(table: str) -> bool:
            cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,))
            return cur.fetchone() is not None

        # Service table
        if table_exists('service'):
            if not column_exists(conn, 'service', 'description'):
                conn.execute("ALTER TABLE service ADD COLUMN description TEXT")
                print("  + service.description added")
            if not column_exists(conn, 'service', 'icon'):
                conn.execute("ALTER TABLE service ADD COLUMN icon VARCHAR(50)")
                print("  + service.icon added")

        # TeamMember table
        if table_exists('team_member'):
            if not column_exists(conn, 'team_member', 'phone'):
                conn.execute("ALTER TABLE team_member ADD COLUMN phone VARCHAR(20)")
                print("  + team_member.phone added")
            if not column_exists(conn, 'team_member', 'twitter'):
                conn.execute("ALTER TABLE team_member ADD COLUMN twitter VARCHAR(255)")
                print("  + team_member.twitter added")

        # CompanyInfo table
        if table_exists('company_info'):
            if not column_exists(conn, 'company_info', 'name'):
                conn.execute("ALTER TABLE company_info ADD COLUMN name VARCHAR(100)")
                # backfill from legacy company_name if present
                cols = {row[1] for row in conn.execute("PRAGMA table_info(company_info)").fetchall()}
                if 'company_name' in cols:
                    conn.execute("UPDATE company_info SET name = company_name WHERE name IS NULL OR name = ''")
                print("  + company_info.name added")
            if not column_exists(conn, 'company_info', 'logo_filename'):
                conn.execute("ALTER TABLE company_info ADD COLUMN logo_filename VARCHAR(255)")
                print("  + company_info.logo_filename added")
            if not column_exists(conn, 'company_info', 'favicon_filename'):
                conn.execute("ALTER TABLE company_info ADD COLUMN favicon_filename VARCHAR(255)")
                print("  + company_info.favicon_filename added")
            if not column_exists(conn, 'company_info', 'last_updated'):
                conn.execute("ALTER TABLE company_info ADD COLUMN last_updated DATETIME")
                print("  + company_info.last_updated added")

        # WebsiteContent table
        if table_exists('website_content'):
            if not column_exists(conn, 'website_content', 'title'):
                conn.execute("ALTER TABLE website_content ADD COLUMN title VARCHAR(100)")
                print("  + website_content.title added")
            if not column_exists(conn, 'website_content', 'last_updated'):
                conn.execute("ALTER TABLE website_content ADD COLUMN last_updated DATETIME")
                print("  + website_content.last_updated added")

        conn.commit()
        print("[ok] migrations committed")
    finally:
        conn.close()


if __name__ == '__main__':
    # Default DB per app config
    migrate_db('africana_ventures.db')
    # Also try instance db if present
    migrate_db(os.path.join('instance', 'africana_ventures.db'))


