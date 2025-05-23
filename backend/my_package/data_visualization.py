import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from typing import Literal


def show_plot( df, col, *, group_method: Literal['mean',
                                                 'median',
                                                 'mode'] = 'mean'):
## create images directory 
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    title_ = col

    ## show distribution
    if col == 'job_title':
        plt.xticks(rotation=90)

        # group jobs that less than 45
        threshold = 45
        temp_df = df[[col, 'salary']]
        job_counts = temp_df[col].value_counts()
        valid_jobs = job_counts[job_counts > threshold].index

        temp_df.loc[:, col] = temp_df[col] \
            .where(temp_df[col].isin(valid_jobs), other='Other')

        plot_df = temp_df \
            .groupby([col], observed=False) \
            .salary.agg(count='count',
                        mean='mean',
                        median=lambda x: x.median(),
                        mode=lambda x: x.mode().mean(),)

        # place col: Other at the end
        plot_df = pd.concat([
            plot_df.drop('Other'),
            plot_df.loc[['Other'], :]
        ])

        # plot barplot
        bars = sns.barplot(data=plot_df['count'],
                           color=(0.4, 0.9, 0.9),
                           edgecolor='black',
                           saturation=1,
                           alpha=0.8,
                           width=1)
        bars.margins(x=0.05)

    else :
        # plot histgram
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
    plt.title(f"{title_} histogram")
    plt.tight_layout()

    ## save image
    fig_fname = f'{col}_histogram.png'
    plt.savefig(os.path.join(images_dir, fig_fname),
                bbox_inches='tight')

    ## plot image
    plt.show()

    ################## Group Mean Salary ##################
    if col == 'salary':
        return

    ### get feature mean|median|mode with target feature
    ## mode
    if group_method == 'mode':
        d = df.groupby([col], observed=False)['salary'] \
                .agg(mode=lambda x: x.mode().mean())
    ## median
    elif group_method == 'median':
        d = df.groupby([col], observed=False)['salary'] \
                .agg(median=lambda x: x.median())
    ## mean
    else :
        d = df.groupby([col], observed=False)['salary'].mean()

    if col == 'job_title':
        plt.xticks(rotation=90)
        d = plot_df

    plt.bar(d.index, d[group_method], width=1, color=(0.9, 0.4, 0.9),
            edgecolor='black', alpha=0.8)

    plt.xlabel('')
    plt.ylabel(f"{group_method.capitalize()} Salary")
    plt.title(title_)
    plt.tight_layout()

    ## save image
    fig_fname = f'{col}_salary_{group_method}_relation.png'
    plt.savefig(os.path.join(images_dir, fig_fname),
                bbox_inches='tight')

    ## plot image
    plt.show()


def show_heatmap(X_train: pd.DataFrame,
                 y_train: pd.DataFrame,
                 use_poly: bool = False) -> None:
    ## create images directory 
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    X_train['salary'] = y_train

    annot_size = 10
    if use_poly:
        annot_size = 7

    plt.figure(figsize=(10, 10))
    sns.heatmap(X_train.corr(),
                annot=True,
                cmap='coolwarm',
                annot_kws={'size': annot_size})

    plt.tight_layout()
    

    ## save fig
    plt.savefig(os.path.join(images_dir, 'features_heatmap.png'),
                bbox_inches='tight')
    ## show fig
    plt.show()



if __name__ == "__main__":
    import os
    import shutil

    from data_cleansing import cleaning_data

    ## load csv 
    FILE_NAME = "../Salary_Data.csv"
    df = pd.read_csv(FILE_NAME, delimiter=',')
    df = cleaning_data(df, has_target_columns=True)
    
    images_dir = os.path.join(os.getcwd(), 'images')
    os.makedirs(images_dir, exist_ok=True)

    # for col in df.columns:
    #     show_plot(df, col, group_method='median')


    from data_spliting import spliting_data

    X_train, X_test, y_train, y_test = spliting_data(df)

    from data_preprocessing import preprocess_data

    X_train_, X_test_ = preprocess_data(X_train, y_train, X_test, use_polynomial=True)

    show_heatmap(X_train_, y_train, use_poly=True)

    shutil.rmtree(images_dir)