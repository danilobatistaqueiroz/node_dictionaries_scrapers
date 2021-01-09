import workfiles

workfiles.dictionary = 'howjsay'
workfiles.word_list = '2001-3000'

def sound_mp3_directory():
    print('change the reference of sound in mp3 field')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        fields[1] = workfiles.add_wordlist_dictionary_soundmp3(fields[1])
        newline = fields[0]+'\t'+fields[1]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()

def remove_wordlist_from_name():
    print('remove wordlist from name')
    rd = workfiles.read_lasttmp_or_output()
    cnt = workfiles.new_tmpfile()
    while True:
        line = rd.readline()
        if not line :
            break
        line = line[:-1]
        fields = line.split('\t')
        fields[1] = fields[1].replace(workfiles.word_list+'-','')
        newline = fields[0]+'\t'+fields[1]+'\n'
        workfiles.write_tmpfile(cnt,newline,'a')
    rd.close()


workfiles.rem_tmpfiles()
remove_wordlist_from_name()
sound_mp3_directory()
workfiles.treat_line1001()
workfiles.rem_tmpfiles_create_outfile()