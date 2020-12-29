def substitutes(dirt, text, content):
    pos = 1
    while pos > 0 :
        pos = content.find(dirt,pos+1)
        if pos == -1 :
            break
        content = content[:pos] + text + content[pos+len(dirt):]
    return content

def clean_translations():
    four_commas = ',​,, ,'
    four_commas_spaces = ', ​,, ,'
    f_commas = ', f ​,, ,'
    endline = ',​,\n'
    dot_comma = ',​,·'
    two_comma_dot = ', ​,·'
    m_comma = ', m ​,·'
    tab_comma = '\t, ,'
    f_dot_comma = ', f ​,·'
    m_commas = ', m ​,, ,'
    three_comma = ' ​,, ,'
    s_dot_comma = ', s ​,·'
    comma_f_dot = ', f ​,·'
    comma_m_comma = ', m ​,'
    comma_prep_comma = ', prep ​,'
    comma_pl_dot = ', pl ​,·'
    comma_f_comma = ', f ​,'
    comma_num_comma = ', num ​,'
    dot_dot_end = ', ​,\n'
    comma_np_f_comma = ', np f ​,'
    comma_prep_comma_dot = ', prep ​,·'
    comma_s_comma = ', s,'
    comma_s = ', s ​,'
    comma_interj_comma = ', interj ​,'
    comma_conj_comma = ', conj ​,'
    num_comma = ', num,'
    comma_new_ln = ',\n'
    comma_sp_prep_comma = ', prep,'
    prop = ', prop.'
    sp_pl = ' pl​,'
    comma_n_comma = ',n,'
    sp_pl_sp = ' pl ​'
    comma_pron_comma = ', pron,'
    comma_conj = ', conj,'
    part_pas = ', part. pas.,'
    np_m_comma = ', np m,'

    with open ('3001-4000-lingueeauto.csv', 'r') as file:
        content = file.read()
    content = substitutes(four_commas,',',content)
    content = substitutes(f_commas,',',content)
    content = substitutes(endline,'\n',content)
    content = substitutes(dot_comma,',',content)
    content = substitutes(m_comma,',',content)
    content = substitutes(tab_comma,'\t',content)
    content = substitutes(f_dot_comma,',',content)
    content = substitutes(m_commas,',',content)
    content = substitutes(s_dot_comma,',',content)
    content = substitutes(four_commas_spaces,',',content)
    content = substitutes(comma_f_dot,',',content)
    content = substitutes(three_comma,',',content)
    content = substitutes(two_comma_dot,',',content)
    content = substitutes(comma_m_comma,',',content)
    content = substitutes(comma_prep_comma,',',content)
    content = substitutes(comma_pl_dot,',',content)
    content = substitutes(comma_f_comma,',',content)
    content = substitutes(comma_num_comma,',',content)
    content = substitutes(dot_dot_end,'\n',content)
    content = substitutes(comma_np_f_comma,',',content)
    content = substitutes(comma_prep_comma_dot,',',content)
    content = substitutes(comma_s_comma,',',content)
    content = substitutes(comma_s,',',content)
    content = substitutes(comma_interj_comma,',',content)
    content = substitutes(comma_conj_comma,',',content)
    content = substitutes(num_comma,',',content)
    content = substitutes(comma_new_ln,'\n',content)
    content = substitutes(comma_sp_prep_comma,',',content)
    content = substitutes(prop,',',content)
    content = substitutes(sp_pl,',',content)
    content = substitutes(comma_n_comma,',',content)
    content = substitutes(sp_pl_sp,' ',content)
    content = substitutes(comma_pron_comma,',',content)
    content = substitutes(comma_conj,',',content)
    content = substitutes(part_pas,',',content)
    content = substitutes(np_m_comma,',',content)
    content = substitutes(',,',',',content)
    content = substitutes(', ,',',',content)

    file = open('3001-4000-lingueeauto-clean.csv','w')
    file.write(content)

clean_translations()