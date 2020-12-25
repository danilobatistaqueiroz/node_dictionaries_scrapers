import os
new_file = '4001-5000-reverso_new.csv'
def remove_same_word():
    fread = open ('4001-5000-reverso.csv', 'r')
    if os.path.exists(new_file):
        os.remove(new_file)
    fappend = open(new_file,'a')
    counter = 0
    while True:
        counter+=1
        line = fread.readline()
        if not line :
            break
        if len(line) < 5 :
            fappend.write(line)
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            fappend.write(line)
            continue
        words = terms[1].split(',')
        new_words = []
        for word in words :
            new_word = word.replace('    ',' ')
            new_word = new_word.replace('   ',' ')
            new_word = new_word.replace('  ',' ')
            new_word = new_word.replace(' ',', ')
            strip_word = word.strip()
            if strip_word.lower() == terms[0].lower() :
                continue
            if strip_word == '' or strip_word == ',' :
                continue
            new_words.append(new_word)
            new_line = ', '.join(new_words)
            new_line = new_line.replace(', , ',', ')
        line = terms[0]+'\t'+new_line
        fappend.write(line)
    fread.close()


remove_same_word()