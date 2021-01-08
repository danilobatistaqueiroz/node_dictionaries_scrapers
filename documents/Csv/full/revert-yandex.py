import os
new_file = '16001-17000-yandex-reverted.csv'
def revert_list():
    fread = open ('16001-17000-yandex.csv', 'r')
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
        words = terms[2].split(',')
        words.reverse()
        new_line = ','.join(words)
        new_line = new_line.replace('\n','')
        new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        fappend.write(line)
    fread.close()


remove_same_word()