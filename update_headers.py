import os

def update_file(file_path):
    print(f"Updating {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # --- VendingHeader.tsx Replacements ---
            if 'VendingHeader.tsx' in file_path:
                # Desktop Select (Line 55 approx)
                if '<select' in line and 'bg-transparent' in line and 'En' in lines[i+1]:
                    print("Found Desktop Select in VendingHeader")
                    indent = line[:line.find('<select')]
                    new_lines.append(f'{indent}<select\n')
                    new_lines.append(f'{indent} onChange={{(e) => {{\n')
                    new_lines.append(f'{indent}  const lang = e.target.value;\n')
                    new_lines.append(f'{indent}  document.cookie = `googtrans=/en/${{lang}}; path=/`;\n')
                    new_lines.append(f'{indent}  window.location.reload();\n')
                    new_lines.append(f'{indent} }}\}}\n')
                    new_lines.append(line.lstrip()) # className line
                    # Skip old options
                    i += 1
                    while '</select>' not in lines[i]:
                        i += 1
                    # Add new options
                    new_lines.append(f'{indent} <option value="en">En</option>\n')
                    new_lines.append(f'{indent} <option value="ar">Ar</option>\n')
                    new_lines.append(lines[i]) # </select>
                    i += 1
                    continue

                # Mobile Select (Line 134 approx)
                if '<select' in line and 'border-neutral-gray-lightest' in line:
                    print("Found Mobile Select in VendingHeader")
                    indent = line[:line.find('<select')]
                    new_lines.append(f'{indent}<select\n')
                    new_lines.append(f'{indent} onChange={{(e) => {{\n')
                    new_lines.append(f'{indent}  const lang = e.target.value;\n')
                    new_lines.append(f'{indent}  document.cookie = `googtrans=/en/${{lang}}; path=/`;\n')
                    new_lines.append(f'{indent}  window.location.reload();\n')
                    new_lines.append(f'{indent} }}\}}\n')
                    new_lines.append(line.lstrip())
                     # Skip old options
                    i += 1
                    while '</select>' not in lines[i]:
                        i += 1
                    # Add new options
                    new_lines.append(f'{indent} <option value="en">En</option>\n')
                    new_lines.append(f'{indent} <option value="ar">Ar</option>\n')
                    new_lines.append(lines[i]) # </select>
                    i += 1
                    continue

            # --- Catering Header.tsx Replacements ---
            elif 'layout\\Header.tsx' in file_path or 'layout/Header.tsx' in file_path:
                # Desktop Select
                if '<select' in line and 'bg-transparent' in line:
                     # Identify it's the right select by context if needed, but in Header.tsx typical locations are unique enough
                    print("Found Desktop Select in Catering Header")
                    indent = line[:line.find('<select')]
                    new_lines.append(f'{indent}<select\n')
                    new_lines.append(f'{indent} onChange={{(e) => {{\n')
                    new_lines.append(f'{indent}  const lang = e.target.value;\n')
                    new_lines.append(f'{indent}  document.cookie = `googtrans=/en/${{lang}}; path=/`;\n')
                    new_lines.append(f'{indent}  window.location.reload();\n')
                    new_lines.append(f'{indent} }}\}}\n')
                    new_lines.append(line.lstrip())
                    # Skip old options
                    i += 1
                    while '</select>' not in lines[i]:
                        i += 1
                    # Add new options
                    new_lines.append(f'{indent} <option value="en">En</option>\n')
                    new_lines.append(f'{indent} <option value="ar">Ar</option>\n')
                    new_lines.append(lines[i]) # </select>
                    i += 1
                    continue

            new_lines.append(line)
            i += 1
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
            
    except Exception as e:
        print(f"Error updating {file_path}: {e}")

# Run updates
update_file(r'c:\Users\User\Desktop\main\Dosta\src\components\vending_home\VendingHeader.tsx')
update_file(r'c:\Users\User\Desktop\main\Dosta\src\pages\catering\components\layout\Header.tsx')
