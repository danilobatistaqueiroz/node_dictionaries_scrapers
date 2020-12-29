x = ['lutadora','lutador','(3)lutador','(3)caça']


if x[0][:-1] == x[1] and x[0][-1:] == 'a' :
    print(x[1])

if len(x[0]) == len(x[1]) and x[1][-1:] == 'o' and x[0][-1:] == 'a' :
    print(x[1])