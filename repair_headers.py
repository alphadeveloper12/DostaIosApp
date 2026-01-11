import os

def repair_file(file_path):
    print(f"Repairing {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for i, line in enumerate(lines):
        # The bad line usually starts immediately with <select className= because lstrip() was used
        if line.startswith('<select className="'):
            print(f"Fixing line {i+1}")
            # Remove '<select ' to leave just 'className="..."'
            # And add generic indentation (e.g. 7 spaces to match <select opening roughly)
            fixed_line = line.replace('<select ', ' ', 1).strip()
            fixed_line = '       ' + fixed_line + '\n'
            new_lines.append(fixed_line)
        else:
            new_lines.append(line)
            
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

repair_file(r'c:\Users\User\Desktop\main\Dosta\src\components\vending_home\VendingHeader.tsx')
repair_file(r'c:\Users\User\Desktop\main\Dosta\src\pages\catering\components\layout\Header.tsx')
