module Types
	class UserType < GraphQL::Schema::Object
		field :id, ID, null: false do
			def authorized?(object, args, context)
				context[:current_user].id == object.id
			end
		end
		field :name, String, null: false
		field :email, String, null: false
		field :groups, [Types::GroupType], null: false do
			def authorized?(object, args, context)
				context[:current_user].id == object.id
			end
		end
		field :issue_boards, [Types::IssueBoardType], null: false do
			def authorized?(object, args, context)
				context[:current_user].id == object.id
			end
		end
	end
end