import workfiles

workfiles.word_list = '1001-2000'
workfiles.dictionary = 'reverso'

def remove_same_word():
    print('removing term equal word')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        if len(line) < 5 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        terms = line.split('\t')
        if len(terms) == 1 :
            workfiles.write_tmpfile(cnt,line,'a')
            continue
        words = terms[1].split(',')
        new_words = []
        for word in words :
            ini = word.find(')')
            if word[ini+1:][0].isupper() :
                continue
            if word[ini+1:].strip().lower() == terms[0].strip() :
                continue
            new_words.append(word)
        new_line = ','.join(new_words)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

workfiles.rem_tmpfiles()
remove_same_word()
workfiles.remove_last_comma()
workfiles.treat_line1001()
workfiles.rem_tmpfiles_create_outfile()