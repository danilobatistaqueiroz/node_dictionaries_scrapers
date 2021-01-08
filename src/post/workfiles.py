import os
import shutil
import glob

word_list = ''
dictionary = ''

def rem_tmpfiles_create_outfile():
    cnt = get_last_tmpcnt()
    if cnt == 0:
        raise Exception("tmp files doesn't exist")
    shutil.copyfile(f'tmp/{word_list}-{dictionary}.tmp{cnt}',f'out/{word_list}-{dictionary}.out.csv')
    os.system(f'rm tmp/{word_list}-{dictionary}.tmp*')

def new_tmpfile():
    cnt=get_last_tmpcnt()
    cnt=cnt+1
    out_file = open(f'tmp/{word_list}-{dictionary}.tmp{cnt}', 'w')
    out_file.close()
    return cnt

def get_last_tmpcnt():
    files = glob.glob(f'tmp/{word_list}-{dictionary}.tmp*')
    return len(files)

def read_lasttmp_or_output():
    cnt = get_last_tmpcnt()
    if cnt == 0:
        return open(f'../../output/{word_list}-{dictionary}.csv', 'r')
    else:
        return open(f'tmp/{word_list}-{dictionary}.tmp{cnt}', 'r')

def get_content_tmp_output():
    rd = read_lasttmp_or_output()
    content = rd.read()
    rd.close()
    return content

def write_tmpfile(cnt, line, oper):
    with open(f'tmp/{word_list}-{dictionary}.tmp{cnt}', oper) as the_file:
        the_file.write(line)

def count_words():
    content = get_content_tmp_output()
    length = len(content.split('\n'))
    if length < 1000:
        print(red('arquivo com menos de 1000 palavras'))

def red(text):
    return colored(255, 0, 0, text)

def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)