import workfiles

def remove_less_half_frequency():
    print('removing term with less than half frequency from another term')
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
        translations = terms[1].split(',')
        new_trs = []
        anterior_frequency = 2
        frequency = 0
        for translation in translations :
            ini = translation.find(')')
            txt_freq = translation[1:ini]
            if txt_freq != '' :
                frequency = int(txt_freq)
            if frequency < (anterior_frequency/2) :
                continue
            anterior_frequency = frequency
            new_trs.append(translation)
        new_line = ','.join(new_trs)
        if new_line[-1:] != '\n' :
            new_line = new_line+'\n'
        line = terms[0]+'\t'+new_line
        workfiles.write_tmpfile(cnt,line,'a')
    rd.close()

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

def only_four_translations():
    print('let only the first 4 translations and remove the other ones')
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
        translations = terms[1].split(',')
        new_line = ','.join(translations[:4])
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
    remove_less_half_frequency()
    only_four_translations()
    workfiles.treat_line1001()
    workfiles.rem_tmpfiles_create_outfile()