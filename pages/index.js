import { server } from '../config';
import styled from 'styled-components';

export default function Home({ data }) {
  return (
    <div>
      {data.nytOutput.map((i) => {
        return (
          <ArticleStyle key={i.title}>
            <a href={i.link}>
              <img src={i.pic} alt='' />
              <h2>{i.title}</h2>
            </a>
          </ArticleStyle>
        );
      })}
    </div>
  );
}

const ArticleStyle = styled.article`
 
    display: grid;
    grid-template-columns: 1fr;
    border-radius: 10px;
    margin: 1rem;
    max-width: 800px;
    a {
      color: inherit;
      text-decoration: none;
      h2 {
        padding: 5px;
      }
      img {
        width: 100%;
        border-radius: 10px 10px 0px 0px;
      }
    }
  }
  // for large screens
  @media (min-width: 768px) {
 
      margin: 1rem auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      &:hover {
        background: rgb(243, 243, 243);
        transition: ease-in 0.2s;
        img {
          transition: ease-in 0.2s;
          opacity: 0.9;
        }
      }
      a {
        display: flex;
        img {
          width: 400px;
          border-radius: 10px 0px 0px 10px;
        }
        h2 {
          width: 300px;
        }
      }
    
  
`;

export async function getServerSideProps() {
  const res = await fetch(`${server}/api/nyt`);
  const data = await res.json();
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data }, // will be passed to the page component as props
  };
}
