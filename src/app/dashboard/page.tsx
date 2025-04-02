import Header from "@/app/header/Header";
import BlogPage from "@/app/blog/page"; // Ensure correct path

export default function BlogLayout() {
    return (
        <Header>
            <BlogPage />
        </Header>
    );
}
