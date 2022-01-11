import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import fetch from 'node-fetch'
import { previousTuesday } from 'date-fns'
import { finished } from 'stream'
import base64 = require('js-base64').Base64

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getAllPostIds() {
    const repoUrl = "https://api.github.com/repos/next_api_study/contents/posts/"
    const response = await fetch(repoUrl)
    const files = await response.json()
    const fileNames = files.map(file => file.name)

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
    const repoUrl = `https://api.github.com/repos/next_api_study/contents/posts/${id}.md`
    const response = await fetch(repoUrl)
    const file = await response.json()
    const fileContents = base64.decode(file.content)

    const matterResult = matter(fileContents)

    const processedContent = await remark()
    .use(html)
    .process(matterResult)

    const contentHtml = processedContent.toString()

    return {
        id,
        contentHtml,
        ...matterResult.data
    }

}