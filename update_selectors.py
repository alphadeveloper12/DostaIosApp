import os

files = [
    r"c:\Users\User\Desktop\main\Dosta\src\components\layout\Header.tsx",
    r"c:\Users\User\Desktop\main\Dosta\src\pages\catering\components\layout\Header.tsx",
    r"c:\Users\User\Desktop\main\Dosta\src\components\vending_home\VendingHeader.tsx"
]

injection = '        defaultValue={document.cookie.includes("googtrans=/en/ar") ? "ar" : "en"}'

def update_file(path):
    print(f"Processing {path}")
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check for <select tag
        if '<select' in line:
            # Check if next line is onChange (to avoid other selects if any, though unlikely here)
            # OR just strictly inject into the Language Selects we know.
            # We know the language selects have onChange={(e) => {
            
            # Look ahead to verify it's the right select
            is_lang_select = False
            for j in range(1, 5): # Check next few lines
                if i + j < len(lines) and 'onChange={(e) => {' in lines[i+j]:
                    is_lang_select = True
                    break
            
            if is_lang_select:
                print(f"Found Select at line {i+1}")
                # We want to inject defaultValue.
                # But wait, if we already injected it, we shouldn't do it again.
                # Check current and next lines for defaultValue
                already_has = False
                for j in range(1, 5):
                    if i + j < len(lines) and 'defaultValue' in lines[i+j]:
                        already_has = True
                        break
                
                if not already_has:
                    new_lines.append(line)
                    # Inject with same indentation as the onChange line roughly
                    # We can use the indentation of the <select line + spaces
                    indent = line[:line.find('<select')] + ' '
                    new_lines.append(f'{injection}\n')
                else:
                    new_lines.append(line)
            else:
                 new_lines.append(line)
        else:
            new_lines.append(line)
        i += 1
        
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

for f in files:
    update_file(f)
