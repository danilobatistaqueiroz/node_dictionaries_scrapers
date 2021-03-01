import workfiles

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
        word = terms[0].strip().lower()
        translations = terms[1].split(',')
        new_trs = []
        for translation in translations :
            ini = translation.find(')')
            if ini > len(translation) or ini == -1:
                continue
            if translation[ini+1:][0].isupper() :
                continue
            if translation[ini+1:].strip().lower() == word :
                continue
            new_trs.append(translation)
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

def initialize(dictionary, word_list):
    workfiles.word_list = word_list
    workfiles.dictionary = dictionary

def start():
    workfiles.rem_tmpfiles()
    workfiles.remove_last_comma()
    remove_same_word()
    workfiles.treat_line1001()
    workfiles.rem_tmpfiles_create_outfile()