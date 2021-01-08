import os
new_file = '16001-17000-full-clean.csv'
def remove_same_word():
    fread = open ('16001-17000-full.csv', 'r')
    if os.path.exists(new_file):
        os.remove(new_file)
    fappend = open(new_file,'w')
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
        anterior = ''
        for word in words :
            word = word.lower().strip()
            if word != anterior:
                new_words.append(word)
            anterior = word
        new_words = list(set(new_words))
        new_line = ','.join(new_words)
        new_line = new_line.replace('\n','')
        new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        fappend.write(line)
    fread.close()


remove_same_word()