import { FC, SyntheticEvent, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { Button } from '@components/button'
import { Space } from '@components/space'
import { Typography } from '@components/typography'
import { CurrentTopicContext } from '@context/topics-context'
import CommentController from '@controllers/comment-controller'
import TopicController from '@controllers/topic-controller'
import { NewComment } from '@core/types'
import { useAppSelector } from '@store/hooks'

import styles from './styles.module.css'

const addComment = async (data: NewComment) => {
  await CommentController.addCommentToTopic(data)
}

export const AddCommentForm: FC = () => {
  const { topicId } = useParams()
  const { currentUser } = useAppSelector(state => state.user)
  const { setTopic } = useContext(CurrentTopicContext)

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const textareaValue = (
      (e.target as HTMLFormElement)[0] as HTMLTextAreaElement
    ).value

    const data = {
      topicId,
      text: textareaValue,
      username: currentUser?.login,
    }

    try {
      await addComment(data as NewComment)

      if (!topicId) {
        return
      }

      const topic = await TopicController.getTopicById(topicId)
      if (topic) {
        setTopic(topic)
      }

      ;((e.target as HTMLFormElement)[0] as HTMLTextAreaElement).value = ''
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Space gap="16px" align="center">
        <Space gap="8px" className={styles.commentField}>
          <Typography fontSize="l">
            <label htmlFor="comment-textarea">Enter your comment</label>
          </Typography>
          <textarea
            autoFocus
            className={styles.textarea}
            rows={5}
            id="comment-textarea"></textarea>
        </Space>

        <Button color="orange">Send</Button>
      </Space>
    </form>
  )
}
