import { usePostQuery } from "../../services/post.service";
import PostItem from "./post-item";

const PostList = () => {
  const { data: posts, } = usePostQuery();

  return (
    <div className="space-y-4">
      {posts?.map((item) => {
        return <PostItem key={item.id} post={item} />;
      })}
    </div>
  );
};

export default PostList;
