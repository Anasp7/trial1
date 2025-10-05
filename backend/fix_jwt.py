#!/usr/bin/env python3
"""
Auto-fix script for JWT identity string conversion
Run this in your backend directory to fix all route files
"""

import os
import re

def fix_jwt_identity(file_path):
    """Fix get_jwt_identity() calls in a Python file"""
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Pattern 1: user_id = get_jwt_identity()
    pattern1 = r'(\s+)(user_id|admin_id|student_id|alumni_id)\s*=\s*get_jwt_identity\(\)'
    replacement1 = r'\1\2 = int(get_jwt_identity())'
    
    if re.search(pattern1, content):
        content = re.sub(pattern1, replacement1, content)
        changes_made.append(f"Fixed: variable = get_jwt_identity() → int(get_jwt_identity())")
    
    # Pattern 2: Direct usage in function calls
    pattern2 = r'User\.query\.get\(get_jwt_identity\(\)\)'
    replacement2 = r'User.query.get(int(get_jwt_identity()))'
    
    if re.search(pattern2, content):
        content = re.sub(pattern2, replacement2, content)
        changes_made.append(f"Fixed: User.query.get(get_jwt_identity())")
    
    # Pattern 3: create_access_token with user.id (not string)
    pattern3 = r'create_access_token\(identity\s*=\s*user\.id\)'
    replacement3 = r'create_access_token(identity=str(user.id))'
    
    if re.search(pattern3, content):
        content = re.sub(pattern3, replacement3, content)
        changes_made.append(f"Fixed: create_access_token(identity=user.id) → str(user.id)")
    
    # Pattern 4: create_access_token with other variables
    pattern4 = r'create_access_token\(identity\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)\.id\)'
    
    def replace_with_str(match):
        var_name = match.group(1)
        return f'create_access_token(identity=str({var_name}.id))'
    
    if re.search(pattern4, content):
        content = re.sub(pattern4, replace_with_str, content)
        changes_made.append(f"Fixed: create_access_token with variable.id")
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        return True, changes_made
    
    return False, []


def main():
    """Main function to fix all route files"""
    
    route_files = []
    routes_dir = 'routes'
    
    # Find all Python files in routes directory
    if os.path.exists(routes_dir):
        for filename in os.listdir(routes_dir):
            if filename.endswith('.py') and filename != '__init__.py':
                route_files.append(os.path.join(routes_dir, filename))
    
    if not route_files:
        print("❌ No route files found in 'routes/' directory")
        print("   Make sure you're running this script from the backend directory")
        return
    
    print("🔍 Scanning files for JWT identity issues...\n")
    
    total_fixed = 0
    for file_path in route_files:
        print(f"📄 Checking: {file_path}")
        fixed, changes = fix_jwt_identity(file_path)
        
        if fixed:
            total_fixed += 1
            print(f"   ✅ FIXED ({len(changes)} changes):")
            for change in changes:
                print(f"      • {change}")
        else:
            print(f"   ⚪ No changes needed")
        print()
    
    if total_fixed > 0:
        print(f"✅ Successfully fixed {total_fixed} file(s)!")
        print("\n⚠️  IMPORTANT: Review the changes and test your API endpoints")
    else:
        print("✅ All files are already up to date!")
    
    print("\n📝 Next steps:")
    print("   1. Review the changes in your route files")
    print("   2. Restart your Flask server")
    print("   3. Test login and protected endpoints")


if __name__ == '__main__':
    main()
