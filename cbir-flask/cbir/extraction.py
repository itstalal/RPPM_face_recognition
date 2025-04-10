from descripteurs import glcm,haralik_feat,bitdesc,glcm_haralik_bit


chemin_a='images/imga.png'
chemin_b='images/imgb.png'
chemin_c='images/imgc.png'

def main():
    print('--------------------GLCM----------------------------')
    features_glcm_a=glcm(chemin_a)
    print(f'Les caractéristiques GLCM de imga:\n{features_glcm_a}')
    features_glcm_b=glcm(chemin_b)
    print(f'Les caractéristiques GLCM de imgb:\n{features_glcm_b}')
    features_glcm_c=glcm(chemin_c)
    print(f'Les caractéristiques GLCM de imgc:\n{features_glcm_c}')


    print('--------------------Haralik----------------------------')
    features_Haralik_a=haralik_feat(chemin_a)
    print(f'Les caractéristiques Haralik de imga:\n{features_Haralik_a}')
    features_Haralik_b=haralik_feat(chemin_b)
    print(f'Les caractéristiques Haralik de imgb:\n{features_Haralik_b}')
    features_Haralik_c=haralik_feat(chemin_c)
    print(f'Les caractéristiques Haralik de imgc:\n{features_Haralik_c}')

    print('--------------------Bit----------------------------')
    features_bit_a=bitdesc(chemin_a)
    print(f'Les caractéristiques bitdesc de imga:\n{features_bit_a}')
    features_bit_b=bitdesc(chemin_b)
    print(f'Les caractéristiques bitdesc de imgb:\n{features_bit_b}')
    features_bit_c=bitdesc(chemin_c)
    print(f'Les caractéristiques bitdesc de imgc:\n{features_bit_c}')

    print('--------------------Concaténation glcm-haralik-Bit----------------------------')
    features_a=glcm_haralik_bit(chemin_a)
    print(f'La concaténation des caractéristiques de imga:\n{features_a}')
    features_b=glcm_haralik_bit(chemin_b)
    print(f'La concaténation des caractéristiques de imgb:\n{features_b}')
    features_c=glcm_haralik_bit(chemin_c)
    print(f'La concaténation des caractéristiques de imgc:\n{features_c}')


if __name__=="__main__":
    main() 