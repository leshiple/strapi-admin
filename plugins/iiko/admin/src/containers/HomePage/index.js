/*
 *
 * HomePage
 *
 */

import React, { useState, memo } from 'react';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import ContainerFluid from 'strapi-admin/admin/src/components/ContainerFluid';
import { Header } from '@buffetjs/custom';
import { Button, Text, Table } from '@buffetjs/core';
import { LoadingBar } from '@buffetjs/styles';

import {
  request,
} from 'strapi-helper-plugin';
import pluginId from '../../pluginId';

const StyledButton = styled(Button)`
  margin-right: 15px;
`;

const Widget = styled.div`
  padding: 20px 30px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 #e3e9f3;
  border-top: 2px solid #007eff;
  margin-top: 20px;
`;

const headers = [
  {
    name: 'iiko id',
    value: 'id',
  },
  {
    name: 'Название',
    value: 'name',
  },
  {
    name: 'Ошибки',
    value: 'errors',
  }
];
const normalizeEntries = (entries) => {
  return entries.map((entry) => {
    const errors = entry.errors.map((error) => {
      return error.keyword;
    });
    return {
      id: entry.data.id,
      name: entry.data.name,
      errors: errors.join(','),
  }});
}

const HomePage = ({ context }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestURL = `/${pluginId}/update`;

  console.log(context);

  const update = async ({ uploadImage = false }) => {
    try {
      setLoading(true);
      const response = await request(requestURL, {
        method: 'POST',
        body: {
          uploadImage,
        },
      }, true);
      setData(response);
    } catch (err) {
      console.error({ err });
      strapi.notification.toggle({
        type: 'warning',
        message: { id: 'notification.error' },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ContainerFluid>
        <Header
          title={{ label: 'iiko' }}
        />
        <StyledButton
          color="primary"
          label="Обновить без изображений"
          disabled={loading}
          onClick={update}
        />
        <StyledButton
          color="primary"
          label="Полное обновление"
          disabled={loading}
          onClick={() => update({ uploadImage: true })}
        />
        {loading &&
          <LoadingBar />
        }
        {loading &&
          <div>Подождите пока закончится обновление. Это может занимать несколько минут...</div>
        }
        {(data && !loading) &&
          <div>
            <Widget>
              <Text
                fontWeight="bold"
                fontSize="lg"
                ellipsis
              >
                Категории
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Добавлено - {data.categories.normal.created.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Обновлено - {data.categories.normal.updated.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Всего - {Object.keys(data.categories.normal.ids).length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Некорректные - { data.categories.broken.length}
              </Text>
              <Table headers={headers} rows={normalizeEntries(data.categories.broken)} />
              {/*<ul>*/}
              {/*  { data.categories.broken.map((category) => {*/}
              {/*    return (*/}
              {/*      <li key={category.data.id}>*/}
              {/*        {category.data.id}-{category.data.name}-*/}
              {/*        {category.errors.map((err) => (*/}
              {/*          <FormattedMessage*/}
              {/*            key={err.keyword}*/}
              {/*            id={`${pluginId}.error.${err.keyword}`}*/}
              {/*          />*/}
              {/*        ))}*/}
              {/*      </li>*/}
              {/*    );*/}
              {/*  }) }*/}
              {/*</ul>*/}
            </Widget>
            <Widget>
              <Text
                fontWeight="bold"
                fontSize="lg"
                ellipsis
              >
                Товары
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Добавлено - {data.products.normal.created.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Обновлено - {data.products.normal.updated.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Всего - {Object.keys(data.products.normal.ids).length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Некорректные - { data.products.broken.length}
              </Text>
              <ul>
                { data.products.broken.map((product) => {
                  return (
                    <li key={product.data.id}>
                      {product.data.id}-{product.data.name}-
                      {product.errors.map((err) => (
                        <FormattedMessage
                          key={err.keyword}
                          id={`${pluginId}.error.${err.keyword}`}
                        />
                      ))}
                    </li>
                  );
                }) }
              </ul>
            </Widget>
            <Widget>
              <Text
                fontWeight="bold"
                fontSize="lg"
                ellipsis
              >
                Модификаторы
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Добавлено - {data.modifiers.normal.created.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Обновлено - {data.modifiers.normal.updated.length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Всего - {Object.keys(data.modifiers.normal.ids).length}
              </Text>
              <Text
                fontSize="md"
                ellipsis
              >
                Некорректные - { data.modifiers.broken.length}
              </Text>
              <ul>
                { data.modifiers.broken.map((modifier) => {
                  return (
                    <li key={modifier.data.id}>
                      {modifier.data.id}-{modifier.data.name}-
                      {modifier.errors.map((err) => (
                        <FormattedMessage
                          key={err.keyword}
                          id={`${pluginId}.error.${err.keyword}`}
                        />
                      ))}
                    </li>
                  );
                }) }
              </ul>
            </Widget>
          </div>
        }
      </ContainerFluid>
    </>
  );
};

export default memo(HomePage);