#include "helpers.h"
#include <stdio.h>
#include <math.h>

// Convert image to grayscale
void grayscale(int height, int width, RGBTRIPLE image[height][width])
{
    int red;
    int green;
    int blue;
    float average;

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            red = image[i][j].rgbtRed;
            green = image[i][j].rgbtBlue;
            blue = image[i][j].rgbtGreen;

            average = (red + green + blue) / 3.0;

            image[i][j].rgbtRed = average;
            image[i][j].rgbtBlue = average;
            image[i][j].rgbtGreen = average;
        }
    }
    return;
}

// Reflect image horizontally
void reflect(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE temp;
    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width/2; ++j)
        {
            int row = width -1-j;
            temp = image[i][j];
            image[i][j] = image[i][row];
            image[i][row] = temp;
        }
    }
    return;
}

void blur(int height, int width, RGBTRIPLE image[height][width])
{

    RGBTRIPLE temp[height][width];

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            int sumRed = 0;
            int sumGreen = 0;
            int sumBlue = 0;

            float counter = 0.00;

            for(int k = -1; k < 2; k++){
                for(int h = -1; h < 2; h++){
                    if( i+k < 0 || i+k > height-1 || j+h < 0|| j+h > width-1)
                    {
                        continue;
                    }
                    sumRed += image[i+k][j+h].rgbtRed;
                    sumGreen += image[i+k][j+h].rgbtGreen;
                    sumBlue += image[i+k][j+h].rgbtBlue;

                    counter++;
                }
                temp[i][j].rgbtRed = round(sumRed/counter);
                temp[i][j].rgbtBlue = round(sumBlue/counter);
                temp[i][j].rgbtGreen = round(sumGreen/counter);
            }

        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j] = temp[i][j];
        }
    }

    return;
}

// Detect edges
void edges(int height, int width, RGBTRIPLE image[height][width])
{
    RGBTRIPLE temp1[height][width];

    int Gx[3][3] = {
        {-1, 0, 1},
        {-2, 0, 2},
        {-1, 0, 1}
    };

    int Gy[3][3] = {
        {-1, -2, -1},
        {0, 0, 0},
        {1, 2, 1}
    };

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            float sqrtRed = 0.00;
            float sqrtGreen = 0.00;
            float sqrtBlue = 0.00;

            float sumRedx = 0.00; // Red x
            float sumRedy = 0.00; // Red y
            float sumGreenx = 0.00; // Green x
            float sumGreeny = 0.00; // Green y
            float sumBluex = 0.00; // Blue x
            float sumBluey = 0.00; // Blue y

            // Algorithm only gets values from map size, ignores(continues) if not on map
            for(int k = -1; k < 2; k++){
                for(int h = -1; h < 2; h++){
                    if( i+k < 0 || i+k > height-1 || j+h < 0|| j+h > width-1)
                    {
                        continue;
                    }
                    sumRedx += ((image[i + k][j + h].rgbtRed) * (Gx[k + 1][h + 1]));
                    sumRedy += ((image[i + k][j + h].rgbtRed) * (Gy[k + 1][h + 1]));
                    sumGreenx += ((image[i + k][j + h].rgbtGreen) * (Gx[k + 1][h + 1]));
                    sumGreeny += ((image[i + k][j + h].rgbtGreen) * (Gy[k + 1][h + 1]));
                    sumBluex += ((image[i + k][j + h].rgbtBlue) * (Gx[k + 1][h + 1]));
                    sumBluey += ((image[i + k][j + h].rgbtBlue) * (Gy[k + 1][h + 1]));
                }

                sqrtRed = pow(sumRedx, 2) + pow(sumRedy, 2);
                sqrtGreen = pow(sumGreenx, 2) + pow(sumGreeny, 2);
                sqrtBlue = pow(sumBluex, 2) + pow(sumBluey, 2);



                sqrtRed = sqrt(sqrtRed);
                sqrtGreen = sqrt(sqrtGreen);
                sqrtBlue = sqrt(sqrtBlue);

                if(sqrtRed > 255)
                    sqrtRed = 255;

                if(sqrtGreen > 255)
                    sqrtGreen = 255;

                if(sqrtBlue > 255)
                    sqrtBlue = 255;

                temp1[i][j].rgbtRed = round(sqrtRed);
                temp1[i][j].rgbtBlue = round(sqrtBlue);
                temp1[i][j].rgbtGreen = round(sqrtGreen);

            }

        }
    }

    for (int i = 0; i < height; i++)
    {
        for (int j = 0; j < width; j++)
        {
            image[i][j] = temp1[i][j];
        }
    }

    return;
}
