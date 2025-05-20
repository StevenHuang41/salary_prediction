import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd



def show_plot(df, col):
    title_ = col

    ## show distribution
    if col == 'job_title':
        plt.xticks(rotation=90)

        ## group jobs that less than 45
        threshold = 45
        agg_job = df[col].value_counts()
        valid_job = agg_job[agg_job > threshold]
        valid_job.loc['Other'] = agg_job[agg_job <= threshold].sum()

        ## plot barplot
        bars = sns.barplot(data=valid_job,
                           color=(0.4, 0.9, 0.9),
                           edgecolor='black',
                           saturation=1,
                           alpha=0.8,
                           width=1)
        bars.margins(x=0.05)

    else :
        ## plot histgram
        bars = sns.histplot(data=df,
                            x=col,
                            color=(0.4, 0.9, 0.9),
                            alpha=0.8)

    ## indicate number on bar
    for bar in bars.patches:
        bbox = bar.get_bbox()
        x0 = bbox.x0
        width = bbox.width
        height = bbox.y1 - bbox.y0
        x_position = x0 + width / 2
        bars.text(x=x_position, y=height + 10,
                  s=f"{int(height)}",
                  ha='center',
                  fontsize=6)

    if '_' not in title_:
        title_ = title_[0].upper() + title_[1:]
    else :
        title_ = " ".join([n_split.capitalize()
                           if n_split != 'of'
                           else n_split
                           for n_split in title_.split('_')])

    plt.xlabel('')
    plt.title(title_)
    plt.tight_layout()

    ## save image
    fig_fname = f'{col}_distribution.png'
    plt.savefig(os.path.join(images_dir, fig_fname),
                bbox_inches='tight')

    ## plot image
    plt.show()

    if col == 'salary':
        return

    ## get feature mean|median|mode with target feature
    ## mode
    # d = (df
    #      .groupby([col], observed=False)['salary']
    #      .agg(lambda x: pd.Series.mode(x)[0]))
    ## quantile
    d = df.groupby([col], observed=False)['salary'].quantile(0.5)

    if col == 'job_title':
        plt.xticks(rotation=90)
        agg_job = df[col].value_counts()

        ## get job title that exceed threshold
        valid_job_index = agg_job[agg_job > threshold].index

        temp_ = df[[col, 'salary']].copy()
        ## create a df, remain jobs exceed threshold,
        ## set the rest jobs 
        temp_[col] = temp_[col].where(
            temp_[col].isin(valid_job_index), other='Other')
        
        ## mode
        # d = (temp_
        #      .groupby([col])['salary']
        #      .agg(lambda x: pd.Series.mode(x)[0]))
        ## quantile
        d = temp_.groupby([col], observed=False)['salary'].quantile(0.5)

        valid_job_index = list(valid_job_index) + ['Other']
        d = d.reindex(valid_job_index)

    plt.bar(d.index, d.values, width=1, color=(0.9, 0.4, 0.9),
            edgecolor='black', alpha=0.8)

    plt.xlabel('')
    plt.ylabel('Mean Salary')
    plt.title(title_)
    plt.tight_layout()

    ## save image
    fig_fname = f'{col}_salary_relation.png'
    plt.savefig(os.path.join(images_dir, fig_fname),
                bbox_inches='tight')

    ## plot image
    plt.show()



if __name__ == "__main__":
    import os
    import shutil

    from data_cleansing import data_cleaning

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = data_cleaning(df, has_target_columns=True)

    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    for col in df.columns:
        show_plot(df, col)

    shutil.rmtree(images_dir)
