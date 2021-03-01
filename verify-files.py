import os

from subprocess import PIPE, Popen
def cmdline(command):
    process = Popen(
        args=command,
        stdout=PIPE,
        shell=True
    )
    return process.communicate()[0]

def red(text):
    return colored(255, 0, 0, text)

def blue(text):
    return colored(0, 200, 0, text)

def colored(r, g, b, text):
    return "\033[38;2;{};{};{}m{} \033[38;2;255;255;255m".format(r, g, b, text)

def file_cnt_words(output_file):
    cnt = str(cmdline(f'wc -l {output_file}'))[2:]
    return int(cnt.split(' ')[0])



for dic in ['cambridge','reverso','google','linguee','howjsay']:
    ini = 1001
    end = 2000
    print(f'iniciando {dic} - {ini}-{end}')
    for i in range(1,41):
        word_list = str(ini)+'-'+str(end)
        output_file = f'output/{word_list}-{dic}.csv'

        if os.path.exists(output_file):
            cntwords = file_cnt_words(output_file)
            if cntwords > 1:
                if cntwords >= 999:
                    print(f'Arquivo completo! {output_file} com {cntwords} linhas')
                else:
                    print(red(f'Arquivo incompleto! {output_file} com {cntwords} linhas'))
            else:
                print(blue(f'arquivo {output_file} vazio!'))
        else:
            print(red(f'faltando o arquivo {output_file}'))

        ini=int(ini)+1000
        end=int(end)+1000
        if ini >= 41001:
            break
        if end == 41000:
            end = 41284